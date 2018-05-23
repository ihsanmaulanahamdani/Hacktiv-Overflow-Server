require('dotenv').config()
const express  = require('express')
const cors     = require('cors')
const logger   = require('morgan')
const mongoose = require('mongoose')
const port     = process.env.PORT || 3000
mongoose.connect('mongodb://hacktivoverflow:overflowhacktiv@ds231740.mlab.com:31740/hacktiv-overflow')

const app = express()

const indexRouter    = require('./routes/index')
const questionRouter = require('./routes/question')
const answerRouter    = require('./routes/answer')

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
  console.log('success connect to database mongoose')
})

app.use(logger('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', indexRouter)
app.use('/questions', questionRouter)
app.use('/answers', answerRouter)

app.listen(port, () => {
  console.log(`Listening on Port ${port}`)
})

module.exports = app