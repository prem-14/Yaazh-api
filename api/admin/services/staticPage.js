const { pgTableColumns } = require('../../../common/columns')
const {
  generateColumns,
  generateInsertData,
  generateQuery,
  generateUpdateData,
} = require('../../../common/commonFunctions')
const AppError = require('../../../common/error')

exports.addNewStaticPage = async (req, next) => {
  req.body.image = JSON.stringify(req.body.image)
  const staticPageConfig = generateColumns(pgTableColumns['sp_c'])

  const { columns, exp, values } = generateInsertData(staticPageConfig, req.body)

  await _pgPool.query(
    `
    INSERT INTO "static_page" (${columns}) VALUES (${exp});
    `,
    [...values]
  )
}

exports.getAllStaticPages = async (req) => {
  const { columns, alias } = generateColumns(pgTableColumns['sp'])

  const recordsQuery = generateQuery(req.body, 0)
  const totalRecordsQuery = generateQuery(req.body, 1)

  const { rows: records } = await _pgPool.query(`
        SELECT ${columns} FROM ${alias} WHERE ${recordsQuery}
    `)

  const { rows: totalRecords } = await _pgPool.query(`
       SELECT count(*) total_count FROM static_page  WHERE ${totalRecordsQuery}
    `)

  return { records, totalRecords: totalRecords[0].total_count }
}

exports.getStaticPage = async (req) => {
  const { rows: records } = await _pgPool.query(
    `
          SELECT * FROM static_page WHERE id = $1
      `,
    [req.query.id]
  )

  return { records }
}

exports.updateStaticPage = async (req) => {
  const staticPageConfig = generateColumns(pgTableColumns['sp_c'])

  const { columns, values, lastIndex: i } = generateUpdateData(staticPageConfig, req.body)
  const { id } = req.body

  const { rows: records } = await _pgPool.query(
    `
      UPDATE static_page SET ${columns} where "id" = $${i + 1}
        `,
    [...values, id]
  )

  return { records }
}

exports.deleteStaticPage = async (req) => {
  const { id } = req.body

  const { rows: records } = await _pgPool.query(
    `
      DELETE FROM static_page where id = $1 ;
      `,
    [id]
  )

  return { records }
}

exports.changeStaticPageStatus = async (req) => {
  const { id, active } = req.body

  const { rows: records } = await _pgPool.query(
    `
      UPDATE static_page set active = $1 where id = ANY($2) ;
      `,
    [active, id]
  )

  return { records }
}
