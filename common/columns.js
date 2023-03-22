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

module.exports = { pgTableColumns }
