const { pgTableColumns } = require('../../../common/columns')
const {
  generateColumns,
  generateInsertData,
  generateQuery,
  generateUpdateData,
} = require('../../../common/commonFunctions')
const AppError = require('../../../common/error')

exports.addNewIngredient = async (req, next) => {
  req.body.image = JSON.stringify(req.body.image)
  const ingredientConfig = generateColumns(pgTableColumns['ing_c'])

  const { columns, exp, values } = generateInsertData(ingredientConfig, req.body)

  await _pgPool.query(
    `
    INSERT INTO "ingredient" (${columns}) VALUES (${exp});
    `,
    [...values]
  )
}

exports.getAllIngredients = async (req) => {
  const { columns, alias } = generateColumns(pgTableColumns['ing'])

  const recordsQuery = generateQuery(req.body, 0)
  const totalRecordsQuery = generateQuery(req.body, 1)

  const { rows: records } = await _pgPool.query(`
        SELECT ${columns} FROM ${alias} WHERE ${recordsQuery}
    `)

  const { rows: totalRecords } = await _pgPool.query(`
       SELECT count(*) total_count FROM ingredient  WHERE ${totalRecordsQuery}
    `)

  return { records, totalRecords: totalRecords[0].total_count }
}

exports.getIngredient = async (req) => {
  const { rows: records } = await _pgPool.query(
    `
          SELECT * FROM ingredient WHERE id = $1
      `,
    [req.query.id]
  )

  return { records }
}

exports.updateIngredient = async (req) => {
  req.body.image = JSON.stringify(req.body.image)
  const ingredientConfig = generateColumns(pgTableColumns['ing_c'])

  const { columns, values, lastIndex: i } = generateUpdateData(ingredientConfig, req.body)
  const { id } = req.body

  const { rows: records } = await _pgPool.query(
    `
      UPDATE ingredient SET ${columns} where "id" = $${i + 1}
        `,
    [...values, id]
  )

  return { records }
}

exports.deleteIngredient = async (req) => {
  const { id } = req.body

  const { rows: records } = await _pgPool.query(
    `
      DELETE FROM ingredient where id = $1 ;
      `,
    [id]
  )

  return { records }
}

exports.changeIngredientStatus = async (req) => {
  const { id, active } = req.body

  const { rows: records } = await _pgPool.query(
    `
      UPDATE ingredient set active = $1 where id = ANY($2) ;
      `,
    [active, id]
  )

  return { records }
}
