const { pgTableColumns } = require('../../../common/columns')
const {
  generateColumns,
  generateQuery,
  generateInsertData,
  generateUpdateData,
} = require('../../../common/commonFunctions')

exports.dummy = async (req) => {
  const customers = generateColumns(pgTableColumns['cus_3'])

  const recordsQuery = generateQuery(req.body, 0)
  const totalRecordsQuery = generateQuery(req.body, 1)

  const { rows: records } = await _pgPool.query(`
    SELECT ${customers.columns}, SUM(oi.quantity * oi.price) as total_revenue
    FROM customers c
    JOIN orders o ON c.id = o.customer_id
    JOIN order_items oi ON o.order_id = oi.order_id
    WHERE ${recordsQuery}
    ;
    `)

  const { rows: totalRecords } = await _pgPool.query(`
  SELECT COUNT(*) AS total_count
  FROM (
      SELECT c.name as customers_name, SUM(oi.quantity * oi.price) as total_revenue
      FROM customers c
      JOIN orders o ON c.id = o.customer_id
      JOIN order_items oi ON o.order_id = oi.order_id
      WHERE ${totalRecordsQuery}
  ) AS subquery;
    `)

  return { records, totalRecords: totalRecords[0].total_count }
}

exports.getAllCustomers = async (req) => {
  const customers = generateColumns(pgTableColumns['cus'])

  const recordsQuery = generateQuery(req.body, 0)
  console.log(recordsQuery)
  const totalRecordsQuery = generateQuery(req.body, 1)

  const { rows: records } = await _pgPool.query(`
      SELECT ${customers.columns} FROM customers c WHERE ${recordsQuery}
  `)

  const { rows: totalRecords } = await _pgPool.query(`
     SELECT count(*) total_count FROM customers c WHERE ${totalRecordsQuery}
  `)

  return { records, totalRecords: totalRecords[0].total_count }
}

exports.getCustomer = async (req) => {
  const { rows: records } = await _pgPool.query(
    `
        SELECT * FROM customers WHERE id = $1
    `,
    [req.query.id]
  )

  return { records }
}

exports.addCustomer = async (req) => {
  const customers = generateColumns(pgTableColumns['cus_1'])

  const { columns, exp, values } = generateInsertData(customers, req.body)

  const { rows: records } = await _pgPool.query(
    `
    INSERT INTO "customers" (${columns}) VALUES (${exp}) RETURNING "name";
    `,
    [...values]
  )

  return { records }
}

exports.updateCustomer = async (req) => {
  const customers = generateColumns(pgTableColumns['cus_2'])

  const { columns, values, lastIndex: i } = generateUpdateData(customers, req.body)
  const { id } = req.body

  const { rows: records } = await _pgPool.query(
    `
    UPDATE "customers" SET ${columns} where "id" = $${i + 1}
      `,
    [...values, id]
  )

  return { records }
}

exports.deleteCustomer = async (req) => {
  const { id } = req.body

  const { rows: records } = await _pgPool.query(
    `
    DELETE FROM "customers" where id = $1 ;
    `,
    [id]
  )

  return { records }
}

exports.changeCustomerStatus = async (req) => {
  const { id, status } = req.body

  const { rows: records } = await _pgPool.query(
    `
    UPDATE "customers" set status = $1 where id = ANY($2) ;
    `,
    [status, id]
  )

  return { records }
}
