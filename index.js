require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/dbConnection')
const verifyJWT = require('./middleware/verifyJWT')

const app = express()
const PORT = process.env.PORT || 3500

connectDB()

app.use(cookieParser());

app.use(express.json());

app.use('/', require('./routes/root'))

app.use('/auth/v1', require('./routes/auth/authRoute'))
app.use('/register/v1', require('./routes/auth/registerRoute'))

app.use(verifyJWT)

app.use('/posts/fetch-all-post', require('./routes/posts/fetchAllPostsRoute'))
app.use('/posts/create-post', require('./routes/posts/createPostRoute'))
app.use('/posts/trending-post', require('./routes/posts/trendingPostsRoute'))

mongoose.connection.on('open', () => {
    console.log('Connected to Database successfully');
    app.listen(PORT, () => {
        console.log(`Server running on PORT: ${PORT}`)
    })
})

mongoose.connection.on('error', err => {
    console.log(err)
})