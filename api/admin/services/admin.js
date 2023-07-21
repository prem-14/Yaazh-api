const { pgTableColumns } = require('../../../common/columns')
const {
  generateColumns,
  generateInsertData,
  generateUpdateData,
  generateQuery,
} = require('../../../common/commonFunctions')
const { AppError } = require('../../../common/error')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { sendEmail } = require('../../../utils/email')

exports.addNewAdmin = async (req) => {
  const unHashedPassword = crypto.randomBytes(4).toString('hex')
  req.body.password = await bcrypt.hash(unHashedPassword, 10)

  console.log(unHashedPassword, req.body.password)

  const adminConfigs = generateColumns(pgTableColumns['adm_1'])
  const { columns, exp, values } = generateInsertData(adminConfigs, req.body)

  const {
    rows: [newAdmin],
  } = await _pgPool.query(
    `
          INSERT INTO "admin" (${columns}) VALUES (${exp}) RETURNING "first_name", "email";
          `,
    [...values]
  )

  const {
    rows: [adminTemplate],
  } = await _pgPool.query("Select subject, template, active from template where title = 'admin_register'")

  if (adminTemplate && adminTemplate.active) {
    let { subject, template } = adminTemplate

    template = template.replace(/{{adminname}}/g, newAdmin.first_name)
    template = template.replace(/{{email}}/g, newAdmin.email)
    template = template.replace(/{{password}}/g, unHashedPassword)
    template = template.replace(/{{login_url}}/g, process.env.ADMIN_URL)

    sendEmail(subject, newAdmin.email, template)
  }
}

exports.getAllAdmins = async (req) => {
  const { columns, alias } = generateColumns(pgTableColumns['adm'])

  const recordsQuery = generateQuery(req.body, 0)
  const totalRecordsQuery = generateQuery(req.body, 1)

  const { rows: records } = await _pgPool.query(`
        SELECT ${columns} FROM ${alias} WHERE ${recordsQuery}
    `)

  const { rows: totalRecords } = await _pgPool.query(`
       SELECT count(*) total_count FROM admin  WHERE ${totalRecordsQuery}
    `)

  return { records, totalRecords: totalRecords[0].total_count }
}

exports.getAdmin = async (req) => {
  const { rows: records } = await _pgPool.query(
    `
          SELECT * FROM admin WHERE id = $1
      `,
    [req.query.id]
  )

  return { records }
}

exports.updateAdmin = async (req) => {
  const adminConfig = generateColumns(pgTableColumns['adm_2'])

  const { columns, values, lastIndex: i } = generateUpdateData(adminConfig, req.body)
  const { id } = req.body

  const { rows: records } = await _pgPool.query(
    `
      UPDATE admin SET ${columns} where "id" = $${i + 1}
        `,
    [...values, id]
  )

  return { records }
}

exports.deleteAdmin = async (req) => {
  const { id } = req.body

  const { rows: records } = await _pgPool.query(
    `
      DELETE FROM admin where id = $1 ;
      `,
    [id]
  )

  return { records }
}

exports.changeAdminStatus = async (req) => {
  const { id, status } = req.body

  const { rows: records } = await _pgPool.query(
    `
      UPDATE admin set status = $1 where id = ANY($2) ;
      `,
    [status, id]
  )

  return { records }
}
