const { pgTableColumns } = require('../../../common/columns')
const {
  generateColumns,
  generateInsertData,
  generateQuery,
  generateUpdateData,
} = require('../../../common/commonFunctions')
const AppError = require('../../../common/error')

exports.addNewFaq = async (req, next) => {
  const faqConfig = generateColumns(pgTableColumns['faq_c'])

  const { columns, exp, values } = generateInsertData(faqConfig, req.body)

  await _pgPool.query(
    `
    INSERT INTO "faq" (${columns}) VALUES (${exp});
    `,
    [...values]
  )
}

exports.getAllFaqs = async (req) => {
  const { columns, alias } = generateColumns(pgTableColumns['faq'])

  const recordsQuery = generateQuery(req.body, 0)
  const totalRecordsQuery = generateQuery(req.body, 1)

  const { rows: records } = await _pgPool.query(`
        SELECT ${columns} FROM ${alias} WHERE ${recordsQuery}
    `)

  const { rows: totalRecords } = await _pgPool.query(`
       SELECT count(*) total_count FROM faq  WHERE ${totalRecordsQuery}
    `)

  return { records, totalRecords: totalRecords[0].total_count }
}

exports.getFaq = async (req) => {
  const { rows: records } = await _pgPool.query(
    `
          SELECT * FROM faq WHERE id = $1
      `,
    [req.query.id]
  )

  return { records }
}

exports.updateFaq = async (req) => {
  const faqConfig = generateColumns(pgTableColumns['faq_c'])

  const { columns, values, lastIndex: i } = generateUpdateData(faqConfig, req.body)
  const { id } = req.body

  const { rows: records } = await _pgPool.query(
    `
      UPDATE faq SET ${columns} where "id" = $${i + 1}
        `,
    [...values, id]
  )

  return { records }
}

exports.deleteFaq = async (req) => {
  const { id } = req.body

  const { rows: records } = await _pgPool.query(
    `
      DELETE FROM faq where id = $1 ;
      `,
    [id]
  )

  return { records }
}

exports.changeFaqStatus = async (req) => {
  const { id, active } = req.body

  const { rows: records } = await _pgPool.query(
    `
      UPDATE faq set active = $1 where id = ANY($2) ;
      `,
    [active, id]
  )

  return { records }
}
