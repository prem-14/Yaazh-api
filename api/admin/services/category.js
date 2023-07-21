const { pgTableColumns } = require('../../../common/columns')
const {
  generateColumns,
  generateInsertData,
  generateQuery,
  generateUpdateData,
  slugify,
} = require('../../../common/commonFunctions')
const AppError = require('../../../common/error')
const { categoryEmitter } = require('../../../events/category')

exports.addCategory = async (req, next) => {
  req.body.slug = slugify(req.body.name)
  const categoryConfig = generateColumns(pgTableColumns['cat_c'])

  const { columns, exp, values } = generateInsertData(categoryConfig, req.body)

  await _pgPool.query(
    `
    INSERT INTO "category" (${columns}) VALUES (${exp});
    `,
    [...values]
  )

  categoryEmitter.emit('update')
}

exports.getAllCategories = async (req) => {
  const { columns, alias } = generateColumns(pgTableColumns['cat'])

  const recordsQuery = generateQuery(req.body, 0)
  const totalRecordsQuery = generateQuery(req.body, 1)

  const { rows: records } = await _pgPool.query(`
        SELECT ${columns} FROM ${alias} WHERE ${recordsQuery}
    `)

  const { rows: totalRecords } = await _pgPool.query(`
       SELECT count(*) total_count FROM category  WHERE ${totalRecordsQuery}
    `)

  return { records, totalRecords: totalRecords[0].total_count }
}

exports.getCategory = async (req) => {
  const { rows: records } = await _pgPool.query(
    `
          SELECT * FROM category WHERE id = $1
      `,
    [req.query.id]
  )

  return { records }
}

exports.updateCategory = async (req) => {
  req.body.slug = slugify(req.body.name)
  const categoryConfig = generateColumns(pgTableColumns['cat_c'])

  const { columns, values, lastIndex: i } = generateUpdateData(categoryConfig, req.body)
  const { id } = req.body

  const { rows: records } = await _pgPool.query(
    `
      UPDATE category SET ${columns} where "id" = $${i + 1}
        `,
    [...values, id]
  )

  categoryEmitter.emit('update')
  return { records }
}

exports.deleteCategory = async (req) => {
  const { id } = req.body

  const { rows: records } = await _pgPool.query(
    `
      DELETE FROM category where id = $1 ;
      `,
    [id]
  )
  categoryEmitter.emit('update')

  return { records }
}

exports.changeCategoryStatus = async (req) => {
  const { id, display } = req.body

  const { rows: records } = await _pgPool.query(
    `
      UPDATE category set display = $1 where id = ANY($2) ;
      `,
    [display, id]
  )
  categoryEmitter.emit('update')

  return { records }
}
