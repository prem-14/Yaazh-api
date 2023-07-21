const express = require('express')
const router = express.Router()

const blogCtrl = require('../controllers/blog')

router.route('/addNewBlog').post(blogCtrl.addNewBlog)
router.route('/getAllBlogs').post(blogCtrl.getAllBlogs)
router.route('/getBlog').get(blogCtrl.getBlog)
router.route('/updateBlog').put(blogCtrl.updateBlog)
router.route('/changeBlogStatus').patch(blogCtrl.changeBlogStatus)

module.exports = router
