const express = require('express')
const router = express.Router()
const fetchAllPostsController = require('../../controllers/posts/fetchAllPostsController')

router.get('/', fetchAllPostsController.fetchAllPosts)

module.exports = router