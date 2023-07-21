const { pgTableColumns } = require('../../../common/columns')
const {
  generateColumns,
  generateInsertData,
  generateQuery,
  generateUpdateData,
} = require('../../../common/commonFunctions')
const AppError = require('../../../common/error')

exports.addNewTemplate = async (req, next) => {
  const templateConfig = generateColumns(pgTableColumns['tmp_1'])

  const { columns, exp, values } = generateInsertData(templateConfig, req.body)
  console.log(`
    INSERT INTO "template" (${columns}) VALUES (${exp});
    `)
  await _pgPool.query(
    `
    INSERT INTO "template" (${columns}) VALUES (${exp});
    `,
    [...values]
  )
}

exports.getAllTemplates = async (req) => {
  const { columns, alias } = generateColumns(pgTableColumns['tmp'])

  const recordsQuery = generateQuery(req.body, 0)
  const totalRecordsQuery = generateQuery(req.body, 1)

  const { rows: records } = await _pgPool.query(`
        SELECT ${columns} FROM ${alias} WHERE ${recordsQuery}
    `)

  const { rows: totalRecords } = await _pgPool.query(`
       SELECT count(*) total_count FROM template  WHERE ${totalRecordsQuery}
    `)

  return { records, totalRecords: totalRecords[0].total_count }
}

exports.getTemplate = async (req) => {
  const { rows: records } = await _pgPool.query(
    `
          SELECT * FROM template WHERE id = $1
      `,
    [req.query.id]
  )

  return { records }
}

exports.updateTemplate = async (req) => {
  const templateConfig = generateColumns(pgTableColumns['tmp_2'])

  const { columns, values, lastIndex: i } = generateUpdateData(templateConfig, req.body)
  const { id } = req.body

  const { rows: records } = await _pgPool.query(
    `
      UPDATE template SET ${columns} where "id" = $${i + 1}
        `,
    [...values, id]
  )

  return { records }
}

exports.deleteTemplate = async (req) => {
  const { id } = req.body

  const { rows: records } = await _pgPool.query(
    `
      DELETE FROM template where id = $1 ;
      `,
    [id]
  )

  return { records }
}

exports.changeTemplateStatus = async (req) => {
  const { id, active } = req.body

  const { rows: records } = await _pgPool.query(
    `
      UPDATE template set active = $1 where id = ANY($2) ;
      `,
    [active, id]
  )

  return { records }
}
