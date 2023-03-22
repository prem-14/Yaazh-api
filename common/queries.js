
const pgSqlQueries = {}

pgSqlQueries.all_countries = "Select {{columns}}, $1 from countries"

module.exports = { pgSqlQueries }