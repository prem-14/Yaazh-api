const { pgTableColumns } = require('../../../common/columns')
const {
  generateColumns,
  generateInsertData,
  generateQuery,
  generateUpdateData,
} = require('../../../common/commonFunctions')
const AppError = require('../../../common/error')

exports.addNewBlog = async (req, next) => {
  req.body.image = JSON.stringify(req.body.image)
  const blogConfig = generateColumns(pgTableColumns['blg_c'])

  const { columns, exp, values } = generateInsertData(blogConfig, req.body)

  await _pgPool.query(
    `
    INSERT INTO "blog" (${columns}) VALUES (${exp});
    `,
    [...values]
  )
}

exports.getAllBlogs = async (req) => {
  const { columns, alias } = generateColumns(pgTableColumns['blg'])

  const recordsQuery = generateQuery(req.body, 0)
  const totalRecordsQuery = generateQuery(req.body, 1)

  const { rows: records } = await _pgPool.query(`
        SELECT ${columns} FROM ${alias} WHERE ${recordsQuery}
    `)

  const { rows: totalRecords } = await _pgPool.query(`
       SELECT count(*) total_count FROM blog  WHERE ${totalRecordsQuery}
    `)

  return { records, totalRecords: totalRecords[0].total_count }
}

exports.getBlog = async (req) => {
  const { rows: records } = await _pgPool.query(
    `
          SELECT * FROM blog WHERE id = $1
      `,
    [req.query.id]
  )

  return { records }
}

exports.updateBlog = async (req) => {
  req.body.image = JSON.stringify(req.body.image)
  const blogConfig = generateColumns(pgTableColumns['blg_c'])

  const { columns, values, lastIndex: i } = generateUpdateData(blogConfig, req.body)
  const { id } = req.body

  const { rows: records } = await _pgPool.query(
    `
      UPDATE blog SET ${columns} where "id" = $${i + 1}
        `,
    [...values, id]
  )

  return { records }
}

exports.deleteBlog = async (req) => {
  const { id } = req.body

  const { rows: records } = await _pgPool.query(
    `
      DELETE FROM blog where id = $1 ;
      `,
    [id]
  )

  return { records }
}

exports.changeBlogStatus = async (req) => {
  const { id, active } = req.body

  const { rows: records } = await _pgPool.query(
    `
      UPDATE blog set active = $1 where id = ANY($2) ;
      `,
    [active, id]
  )

  return { records }
}
