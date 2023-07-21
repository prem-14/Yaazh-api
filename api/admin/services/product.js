const { pgTableColumns } = require('../../../common/columns')
const {
  generateColumns,
  generateInsertData,
  generateQuery,
  generateUpdateData,
  slugify,
  deleteImage,
  asyncForEach,
} = require('../../../common/commonFunctions')
const AppError = require('../../../common/error')

exports.addNewProduct = async (req, next) => {
  req.body.images = JSON.stringify(req.body.images)
  req.body.slug = slugify(req.body.name)

  const productConfig = generateColumns(pgTableColumns['prd_c'])

  const { columns, exp, values } = generateInsertData(productConfig, req.body)
  console.log(`
    INSERT INTO "product" (${columns}) VALUES (${exp});
    `)
  await _pgPool.query(
    `
    INSERT INTO "product" (${columns}) VALUES (${exp});
    `,
    [...values]
  )
}

exports.getAllProducts = async (req) => {
  const { columns, alias } = generateColumns(pgTableColumns['prd'])

  const recordsQuery = generateQuery(req.body, 0)
  const totalRecordsQuery = generateQuery(req.body, 1)

  const { rows: records } = await _pgPool.query(`
        SELECT ${columns} FROM ${alias} WHERE ${recordsQuery}
    `)

  const { rows: totalRecords } = await _pgPool.query(`
       SELECT count(*) total_count FROM product  WHERE ${totalRecordsQuery}
    `)

  return { records, totalRecords: totalRecords[0].total_count }
}

exports.getProduct = async (req) => {
  // const { rows: records } = await _pgPool.query(
  //   `
  //         SELECT *, (select json_agg(i) as ingredients from ingredient i ),
  //         (select json_agg(f) as faqs from faq f),
  //         (select json_agg(b) as badges from badge b) FROM product WHERE id = $1
  //     `,
  //   [req.query.id]
  // )

  const { rows: records } = await _pgPool.query(
    `
          SELECT * FROM product WHERE id = $1
      `,
    [req.query.id]
  )

  return { records }
}

exports.updateProduct = async (req) => {
  req.body.images = JSON.stringify(req.body.images)
  req.body.slug = slugify(req.body.name)

  if (req.body.deletedImages?.length) {
    console.log(req.body.deletedImages)
    await asyncForEach(req.body.deletedImages, (image) => {
      deleteImage(image.public_id)
    })
  }

  const productConfig = generateColumns(pgTableColumns['prd_c'])

  const { columns, values, lastIndex: i } = generateUpdateData(productConfig, req.body)
  const { id } = req.body

  const { rows: records } = await _pgPool.query(
    `
      UPDATE product SET ${columns}, row_level_trigger_flag = row_level_trigger_flag  + 1 where "id" = $${i + 1}
        `,
    [...values, id]
  )

  return { records }
}

exports.deleteProduct = async (req) => {
  const { id } = req.body

  const { rows: records } = await _pgPool.query(
    `
      DELETE FROM product where id = $1 ;
      `,
    [id]
  )

  return { records }
}

exports.changeProductStatus = async (req) => {
  const { id, display } = req.body

  const { rows: records } = await _pgPool.query(
    `
      UPDATE product set display = $1 where id = ANY($2) ;
      `,
    [display, id]
  )

  return { records }
}

exports.changeProductDiscount = async (req) => {
  const { id, discountConfig, ...discount } = req.body
  let records

  if (discountConfig === 'discount_startdate') {
    records = await _pgPool.query(
      `
        UPDATE product set discount_startdate = $1 where id = ANY($2) ;
        `,
      [discount.discount_startdate, id]
    )
  } else if (discountConfig === 'discount_enddate') {
    records = await _pgPool.query(
      `
        UPDATE product set discount_enddate = $1 where id = ANY($2) ;
        `,
      [discount.discount_enddate, id]
    )
  } else if (discountConfig === 'discount') {
    records = await _pgPool.query(
      `
        UPDATE product set discount_option = $1, discount = $2 where id = ANY($3) ;
        `,
      [discount.discount_option, discount.discount, id]
    )
  }

  return { records }
}

/*
SELECT 
    p.name, 
   (select json_agg(i) as ingredients from ingredient i where i.id = ANY(p.ingredients)), 
   (select json_agg(f) as faqs from faq f where f.id = ANY(p.faqs))
FROM product p;

is same as

SELECT 
    p.name, 
    (select json_agg(i) as ingredients from ingredient i where i.id IN (select unnest(p.ingredients))), 
    (select json_agg(f) as faqs from faq f where f.id IN (select unnest(p.faqs)))
FROM product p;
*/
