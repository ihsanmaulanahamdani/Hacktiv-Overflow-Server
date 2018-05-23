const mongoose = require('mongoose')
const Schema   = mongoose.Schema

const answerSchema = new Schema({
  answer: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  questionId: {
    type: Schema.Types.ObjectId,
    ref: 'Question'
  },
  upVotes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  downVotes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
})

answerSchema.pre('save', function (next) {
  let self = this

  this.model('User').findOneAndUpdate({
    _id: self.owner
  }, {
    $push: {
      answers: self._id
    }
  },
    next
  )

  console.log(self.questionId, '==========>')

  this.model('Question').findOneAndUpdate({
    _id: self.questionId
  }, {
    $push: {
      answers: self._id
    }
  },
    next
  )
})

const Answer = mongoose.model('Answer', answerSchema)

module.exports = Answer