const EventEmitter = require('events')
const { getNestedChildren } = require('../common/commonFunctions')
const categoryEmitter = new EventEmitter()

categoryEmitter.on('update', async () => {
  const { rows: categories } = await _pgPool.query('Select id, name, parent_id from category order by position, id')
  const nestedCategories = getNestedChildren(categories, 0, 0)
  _adminIo.emit('nestedCategories', nestedCategories)
})

module.exports = { categoryEmitter }
