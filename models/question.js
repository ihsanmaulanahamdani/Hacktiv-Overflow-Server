const mongoose = require('mongoose')
const Schema   = mongoose.Schema

const questionSchema = new Schema({
  question: String,
  description: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  answers: [{
    type: Schema.Types.ObjectId,
    ref: 'Answer'
  }],
  upVotes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  downVotes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: Number
}, {
  timestamps: true
})

questionSchema.pre('save', function (next) {
  let self = this

  this.model('User').findOneAndUpdate({
    _id: self.owner
  }, {
    $push: {
      questions: self._id
    }
  },
    next
  )
})

const Question = mongoose.model('Question', questionSchema)

module.exports = Question