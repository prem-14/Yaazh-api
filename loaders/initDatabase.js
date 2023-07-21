const { asyncForEach } = require('../common/commonFunctions')

module.exports = async () => {
  global._tableConfig = {}
  // getting all the tables in the database
  const { rows: tables } = await _pgPool.query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public'")

  await asyncForEach(tables, async (table) => {
    _tableConfig[table.tablename] = {}

    // getting all columns in the table
    const { rows: tableColumns } = await _pgPool.query(`SELECT column_name
        FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '${table.tablename}'`)
    const columnValues = tableColumns.map((column) => column.column_name)
    _tableConfig[table.tablename]['columns'] = columnValues

    // getting shortname of the table
    const {
      rows: [{ shortname }],
    } = await _pgPool.query(`
            SELECT shortname from config_table where tablename = '${table.tablename}';
    `)
    _tableConfig[table.tablename]['shortname'] = shortname
  })
}
