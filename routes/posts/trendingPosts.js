const express = require('express')
const router = express.Router()
const trendingPostsController = require('../../controllers/posts/trendingPostsController')

router.get('/:limit', trendingPostsController.trendingPosts)

module.exports = router