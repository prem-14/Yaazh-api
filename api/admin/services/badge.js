const { pgTableColumns } = require('../../../common/columns')
const {
  generateColumns,
  generateInsertData,
  generateQuery,
  generateUpdateData,
} = require('../../../common/commonFunctions')
const AppError = require('../../../common/error')

exports.addNewBadge = async (req, next) => {
  const badgeConfig = generateColumns(pgTableColumns['bdg_c'])

  const { columns, exp, values } = generateInsertData(badgeConfig, req.body)
  console.log(`
    INSERT INTO "badge" (${columns}) VALUES (${exp});
    `)
  await _pgPool.query(
    `
    INSERT INTO "badge" (${columns}) VALUES (${exp});
    `,
    [...values]
  )
}

exports.getAllBadges = async (req) => {
  const { columns, alias } = generateColumns(pgTableColumns['bdg'])

  const recordsQuery = generateQuery(req.body, 0)
  const totalRecordsQuery = generateQuery(req.body, 1)

  const { rows: records } = await _pgPool.query(`
        SELECT ${columns} FROM ${alias} WHERE ${recordsQuery}
    `)

  const { rows: totalRecords } = await _pgPool.query(`
       SELECT count(*) total_count FROM badge  WHERE ${totalRecordsQuery}
    `)

  return { records, totalRecords: totalRecords[0].total_count }
}

exports.getBadge = async (req) => {
  const { rows: records } = await _pgPool.query(
    `
          SELECT * FROM badge WHERE id = $1
      `,
    [req.query.id]
  )

  return { records }
}

exports.updateBadge = async (req) => {
  const badgeConfig = generateColumns(pgTableColumns['bdg_c'])

  const { columns, values, lastIndex: i } = generateUpdateData(badgeConfig, req.body)
  const { id } = req.body

  const { rows: records } = await _pgPool.query(
    `
      UPDATE badge SET ${columns} where "id" = $${i + 1}
        `,
    [...values, id]
  )

  return { records }
}
