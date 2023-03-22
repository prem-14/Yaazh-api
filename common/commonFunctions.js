const { pgSqlQueries } = require('./queries')

exports.catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

exports.catchTransactionAsync = (fn) => {
  return async (req, res, next) => {
    const client = await _pgPool.connect()
    _logger.info(`Client ID: ${client.processID} connected for transaction`)

    Promise.resolve(fn(req, res, next, client))
      .catch(async (err) => {
        await client.query('ROLLBACK')
        _logger.error(`Client ID: ${client.processID} is rolledback`)
        next(err)
      })
      .finally(() => {
        client.release()
        _logger.info(`Client ID: ${client.processID} is released`)
      })
  }
}

exports.pgSqlGenerator = function (data, key) {
  let query = pgSqlQueries[key]
  console.log('query', query)
  const obj = Object.entries(data)
  if (obj.length > 0) {
    obj.forEach(([key, value]) => {
      query = query.replace(new RegExp(`{{${key}}}`, 'g'), value)
    })
  }
  return query
}

exports.asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index += 1) {
    await callback(array[index], index, array)
  }
}

exports.tableWithAlias = (table) => {
  if (_tableConfig[table]) {
    const shortname = _tableConfig[table].shortname
    return `${table} as ${shortname}`
  }

  throw new Error('Could not find table ' + table)
}

exports.generateColumns = (data) => {
  const table = data.table
  const value = data.value
  const columns = data.columns

  if (_tableConfig[table]) {
    let arrayColumns = _tableConfig[table].columns

    if (value === 'include') {
      arrayColumns = arrayColumns.filter((d, i) => columns.includes(d))
    } else if (value === 'exclude') {
      arrayColumns = arrayColumns.filter((d, i) => !columns.includes(d))
    }

    const result = arrayColumns.map((d, i) => {
      return `${_tableConfig[table].shortname}.${d} as ${table}_${d}`
    })

    if (result.length === 0) throw new Error('Zero columns generated for table: ' + table)

    return {
      table,
      arrayColumns,
      columns: result.join(','),
      alias: this.tableWithAlias(table),
    }
  }

  throw new Error('Could not find table ' + table)
}

exports.arrayCheck = (data, expression) => {
  if (data && !Array.isArray(data)) {
    throw new Error(`${expression} data should be an array`)
  }
}

exports.filterData = (data) => {
  let fData = ' 1=1'
  if (!data.filters) {
    data.filters = {}
  }
  const { filters } = data
  Object.keys(filters).forEach((key) => {
    // date: {value: ['2022-03-01', '2022-04-01'],type: 'range',field: 'o.order_date'}
    if (filters[key].type === 'range') {
      if (filters[key].value) {
        fData += ` and ${filters[key].field} >= '${filters[key].value[0]}'
                and ${filters[key].field} <= '${filters[key].value[1]}' `
      }
    }

    if (filters[key].type === 'in') {
      if (filters[key].value) {
        this.arrayCheck(filters[key].value, 'IN')
        fData += ` and ${filters[key].field} IN (${filters[key].value}) `
      }
    }

    if (filters[key].type === 'notin') {
      if (filters[key].value) {
        this.arrayCheck(filters[key].value, 'NOT IN')
        fData += ` and ${filters[key].field} NOT IN (${filters[key].value}) `
      }
    }

    if (filters[key].type === 'eq') {
      if (filters[key].value) {
        fData += ` and ${filters[key].field} = '${filters[key].value}' `
      }
    }

    if (filters[key].type === 'gte') {
      if (filters[key].value) {
        fData += ` and ${filters[key].field} >= ${filters[key].value} `
      }
    }

    if (filters[key].type === 'gt') {
      if (filters[key].value) {
        fData += ` and ${filters[key].field} > ${filters[key].value} `
      }
    }

    if (filters[key].type === 'lte') {
      if (filters[key].value) {
        fData += ` and ${filters[key].field} <= ${filters[key].value} `
      }
    }

    if (filters[key].type === 'lt') {
      if (filters[key].value) {
        fData += ` and ${filters[key].field} < ${filters[key].value} `
      }
    }

    if (filters[key].type === 'like') {
      if (filters[key].value) {
        fData += ` and (${filters[key].field} ILIKE '%${filters[key].value}%') `
      }
    }
  })
  return fData
}

exports.groupData = (data) => {
  let gData = ''
  const { groupby } = data

  this.arrayCheck(groupby, 'GROUP BY')

  if (groupby?.length) {
    gData = ` GROUP BY ${groupby.join(', ')}`
  }
  return gData
}

exports.havingData = (data) => {
  let hData = ''
  const { having } = data

  this.arrayCheck(having, 'HAVING')

  if (having?.length) {
    hData = ` HAVING ${having.join(', ')}`
  }
  return hData
}

exports.paginateData = (data) => {
  let pData = ''
  let { page, limit } = data
  page = page * 1 || 1
  limit = limit * 1 || 20
  const skip = (page - 1) * limit
  pData = ` OFFSET ${skip} LIMIT ${limit}`
  return pData
}

exports.orderData = (data) => {
  let oData = ''
  const { orderby } = data

  this.arrayCheck(orderby, 'ORDER BY')

  if (orderby?.length) {
    oData = ` ORDER BY ${orderby.join(', ')}`
  }
  return oData
}

exports.generateQuery = (data, totalRecords) => {
  const fData = this.filterData(data)
  const gData = this.groupData(data)
  const hData = this.havingData(data)
  const pData = this.paginateData(data)
  const oData = this.orderData(data)
  if (totalRecords) {
    return `${fData}${gData}${hData}`
  } else {
    return `${fData}${gData}${hData}${oData}${pData}`
  }
}

exports.generateInsertData = (tableData, data) => {
  const { arrayColumns, table } = tableData
  console.log(tableData, data)

  const filtered = arrayColumns.filter((column) => data.hasOwnProperty(column))
  const result = {
    table: table,
    columns: [],
    exp: [],
    values: [],
  }

  filtered.forEach((column, i) => {
    result['columns'].push(column)
    result['exp'].push(`$${i + 1}`)
    result['values'].push(data[column])
  })

  return {
    ...result,
    columns: result.columns.join(', '),
    exp: result.exp.join(', '),
    lastIndex: filtered.length,
  }
}

exports.generateUpdateData = (tableData, data) => {
  const { arrayColumns, table } = tableData

  const filtered = arrayColumns.filter((column) => data.hasOwnProperty(column))

  const result = {
    table: table,
    columns: [],
    values: [],
  }
  filtered.forEach((column, i) => {
    result['columns'].push(`"${column}" = $${i + 1}`)
    result['values'].push(data[column])
  })

  return {
    ...result,
    columns: result.columns.join(', '),
    lastIndex: filtered.length,
  }
}

exports.validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    })
    return next()
  } catch (err) {
    next(err)
  }
}
