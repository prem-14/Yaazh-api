const { pgTableColumns } = require('../../../common/columns')
const {
  generateColumns,
  generateInsertData,
  generateQuery,
  generateUpdateData,
} = require('../../../common/commonFunctions')
const AppError = require('../../../common/error')

exports.addNewDiscount = async (req, next) => {
  const discountConfig = generateColumns(pgTableColumns['d_c'])

  const { columns, exp, values } = generateInsertData(discountConfig, req.body)
  const pgClient = await _pgPool.connect()
  try {
    const {
      rows: [result],
    } = await pgClient.query(
      `
        INSERT INTO "discount" (${columns}) VALUES (${exp}) RETURNING *;
        `,
      [...values]
    )

    await pgClient.query(`Update product set discount_startdate = $1, discount_enddate = $2 where id = ANY($3)`, [
      result.start_date,
      result.end_date,
      result.products,
    ])
  } catch (e) {
    await pgClient.query('ROLLBACK')
    throw e
  } finally {
    pgClient.release()
  }
}

exports.getAllDiscounts = async (req) => {
  const { columns, alias } = generateColumns(pgTableColumns['d'])

  const recordsQuery = generateQuery(req.body, 0)
  const totalRecordsQuery = generateQuery(req.body, 1)

  const { rows: records } = await _pgPool.query(`
        SELECT ${columns} FROM ${alias} WHERE ${recordsQuery}
    `)

  const { rows: totalRecords } = await _pgPool.query(`
       SELECT count(*) total_count FROM discount  WHERE ${totalRecordsQuery}
    `)

  return { records, totalRecords: totalRecords[0].total_count }
}

exports.getDiscount = async (req) => {
  const { rows: records } = await _pgPool.query(
    `
          SELECT * FROM discount WHERE id = $1
      `,
    [req.query.id]
  )

  return { records }
}

exports.updateDiscount = async (req) => {
  const discountConfig = generateColumns(pgTableColumns['d_c'])

  const { columns, values, lastIndex: i } = generateUpdateData(discountConfig, req.body)
  const { id } = req.body
  const pgClient = await _pgPool.connect()

  try {
    const {
      rows: [result],
    } = await pgClient.query(
      `
      UPDATE discount SET ${columns} where "id" = $${i + 1} RETURNING *
        `,
      [...values, id]
    )

    await pgClient.query(`Update product set discount_startdate = $1, discount_enddate = $2 where id = ANY($3)`, [
      result.start_date,
      result.end_date,
      result.products,
    ])
  } catch (e) {
    await pgClient.query('ROLLBACK')
    throw e
  } finally {
    pgClient.release()
  }
}

exports.deleteDiscount = async (req) => {
  const { id } = req.body

  const { rows: records } = await _pgPool.query(
    `
      DELETE FROM discount where id = $1 ;
      `,
    [id]
  )

  return { records }
}
