const { getNestedChildren } = require('../../../common/commonFunctions')

exports.allValues = async (req) => {
  const {
    rows: [records],
  } = await _pgPool.query(
    `
        SELECT (select json_agg(json_build_object('name', p.name, 'id', p.id)) as products from product p ),
          (select json_agg(json_build_object('name', i.name, 'id', i.id)) as ingredients FROM ingredient i),
          (select json_agg(json_build_object('question', f.question, 'id', f.id)) as faqs from faq f),
          (select json_agg(b) as badges from badge b),
          (select json_agg(ban) as banners from banner ban) 
      `
  )

  const { rows: allCategories } = await _pgPool.query('Select id, name, parent_id from category order by position, id')
  const nestedCategories = getNestedChildren(allCategories, 0, 0)

  return { ...records, nestedCategories, allCategories }
}
