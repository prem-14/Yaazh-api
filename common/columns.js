// Insert: 1 , Update: 2 , Others: 3,4,5...

const pgTableColumns = {}

pgTableColumns.cus = {
  table: 'customers',
}

pgTableColumns.cus_1 = {
  table: 'customers',
  value: 'exclude',
  columns: ['id', 'created_on', 'updated_on'],
}

pgTableColumns.cus_2 = {
  table: 'customers',
  value: 'exclude',
  columns: ['id', 'created_on', 'updated_on'],
}

pgTableColumns.cus_3 = {
  table: 'customers',
  value: 'include',
  columns: ['name'],
}

/************* admin ********** */

pgTableColumns.adm = {
  table: 'admin',
}

pgTableColumns.adm_1 = {
  table: 'admin',
  value: 'exclude',
  columns: ['id', 'created_on', 'updated_on'],
}

pgTableColumns.adm_2 = {
  table: 'admin',
  value: 'exclude',
  columns: ['id', 'created_on', 'updated_on'],
}

pgTableColumns.adm_3 = {
  table: 'admin',
  value: 'include',
  columns: ['id', 'first_name', 'last_name', 'email', 'password', 'role', 'status', 'permissions'],
}

/************* template ********** */

pgTableColumns.tmp = {
  table: 'template',
}

pgTableColumns.tmp_1 = {
  table: 'template',
  value: 'exclude',
  columns: ['id', 'created_on', 'updated_on'],
}

pgTableColumns.tmp_2 = {
  table: 'template',
  value: 'exclude',
  columns: ['id', 'created_on', 'updated_on'],
}

/************* category ********** */

pgTableColumns.cat = {
  table: 'category',
}

pgTableColumns.cat_c = {
  table: 'category',
  value: 'exclude',
  columns: ['id', 'created_on', 'updated_on'],
}

/************* badge ********** */

pgTableColumns.bdg = {
  table: 'badge',
}

pgTableColumns.bdg_c = {
  table: 'badge',
  value: 'exclude',
  columns: ['id', 'created_on', 'updated_on'],
}

/************* faq ********** */

pgTableColumns.faq = {
  table: 'faq',
}

pgTableColumns.faq_c = {
  table: 'faq',
  value: 'exclude',
  columns: ['id', 'created_on', 'updated_on'],
}

/************* ingredient ********** */

pgTableColumns.ing = {
  table: 'ingredient',
}

pgTableColumns.ing_c = {
  table: 'ingredient',
  value: 'exclude',
  columns: ['id', 'created_on', 'updated_on'],
}

/************* product ********** */

pgTableColumns.prd = {
  table: 'product',
}

pgTableColumns.prd_c = {
  table: 'product',
  value: 'exclude',
  columns: ['id', 'created_on', 'updated_on'],
}

/************* discount ********** */

pgTableColumns.d = {
  table: 'discount',
}

pgTableColumns.d_c = {
  table: 'discount',
  value: 'exclude',
  columns: ['id', 'created_on', 'updated_on'],
}

/************* coupon ********** */

pgTableColumns.cpn = {
  table: 'coupon',
}

pgTableColumns.cpn_c = {
  table: 'coupon',
  value: 'exclude',
  columns: ['id', 'created_on', 'updated_on'],
}

/************* banner ********** */

pgTableColumns.b = {
  table: 'banner',
}

pgTableColumns.b_c = {
  table: 'banner',
  value: 'exclude',
  columns: ['id', 'created_on', 'updated_on'],
}

/************* static_page ********** */

pgTableColumns.sp = {
  table: 'static_page',
}

pgTableColumns.sp_c = {
  table: 'static_page',
  value: 'exclude',
  columns: ['id', 'created_on', 'updated_on'],
}

/************* configuration ********** */

pgTableColumns.con = {
  table: 'configuration',
}

pgTableColumns.con_c = {
  table: 'configuration',
  value: 'exclude',
  columns: ['id', 'created_on', 'updated_on'],
}

/************* blog ********** */

pgTableColumns.blg = {
  table: 'blog',
}

pgTableColumns.blg_c = {
  table: 'blog',
  value: 'exclude',
  columns: ['id', 'created_on', 'updated_on'],
}

/************* customer ********** */

pgTableColumns.cus = {
  table: 'customer',
}

pgTableColumns.cus_c = {
  table: 'customer',
  value: 'exclude',
  columns: ['id', 'created_on', 'updated_on'],
}

pgTableColumns.cus_1 = {
  table: 'customer',
  value: 'include',
  columns: ['email', 'password', 'first_name', 'last_name', 'registertoken', 'registertokenexpire'],
}

pgTableColumns.cus_1A = {
  table: 'customer',
  value: 'include',
  columns: ['first_name', 'last_name', 'google_id', 'status', 'lastlogin'],
}

pgTableColumns.cus_3 = {
  table: 'customer',
  value: 'include',
  columns: ['id', 'first_name', 'last_name', 'email', 'password', 'status'],
}

module.exports = { pgTableColumns }
