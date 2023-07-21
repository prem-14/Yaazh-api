const { pgTableColumns } = require('../../../common/columns')
const {
  generateColumns,
  generateInsertData,
  generateQuery,
  generateUpdateData,
} = require('../../../common/commonFunctions')
const AppError = require('../../../common/error')

exports.addNewConfiguration = async (req, next) => {
  req.body.image = JSON.stringify(req.body.image)
  const configurationConfig = generateColumns(pgTableColumns['con_c'])

  const { columns, exp, values } = generateInsertData(configurationConfig, req.body)

  await _pgPool.query(
    `
    INSERT INTO "configuration" (${columns}) VALUES (${exp});
    `,
    [...values]
  )
}

exports.getAllConfigurations = async (req) => {
  const { columns, alias } = generateColumns(pgTableColumns['con'])

  const recordsQuery = generateQuery(req.body, 0)
  const totalRecordsQuery = generateQuery(req.body, 1)

  const { rows: records } = await _pgPool.query(`
        SELECT ${columns} FROM ${alias} WHERE ${recordsQuery}
    `)

  const { rows: totalRecords } = await _pgPool.query(`
       SELECT count(*) total_count FROM configuration  WHERE ${totalRecordsQuery}
    `)

  return { records, totalRecords: totalRecords[0].total_count }
}

exports.getConfiguration = async (req) => {
  const { rows: records } = await _pgPool.query(
    `
          SELECT * FROM configuration WHERE id = $1
      `,
    [req.query.id]
  )

  return { records }
}

exports.updateConfiguration = async (req) => {
  const configurationConfig = generateColumns(pgTableColumns['con_c'])

  const { columns, values, lastIndex: i } = generateUpdateData(configurationConfig, req.body)
  const { id } = req.body

  const { rows: records } = await _pgPool.query(
    `
      UPDATE configuration SET ${columns} where "id" = $${i + 1}
        `,
    [...values, id]
  )

  return { records }
}

exports.deleteConfiguration = async (req) => {
  const { id } = req.body

  const { rows: records } = await _pgPool.query(
    `
      DELETE FROM configuration where id = $1 ;
      `,
    [id]
  )

  return { records }
}

exports.changeConfigurationStatus = async (req) => {
  const { id, active } = req.body

  const { rows: records } = await _pgPool.query(
    `
      UPDATE configuration set active = $1 where id = ANY($2) ;
      `,
    [active, id]
  )

  return { records }
}
