const express = require('express')
const router = express.Router()
const multer = require('multer')
const createPostController = require('../../controllers/posts/createPostController')

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post(
    '/',
    upload.fields([ // use fields to allow multiple file uploads
        { name: 'video', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 }
    ]),
    createPostController.createPost
)

module.exports = router