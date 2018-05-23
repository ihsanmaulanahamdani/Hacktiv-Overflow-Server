const mongoose = require('mongoose')
const Question = require('../models/question')
const User     = require('../models/user')
const Answer   = require('../models/answer')

module.exports = {
  createQuestion: (req, res) => {
    let { question, description, owner } = req.body

    let newQuestion = new Question({
      question,
      description,
      owner,
      answers: [],
      upVotes: [],
      downVotes: [],
      views: 0
    })

    newQuestion
      .save()
      .then(result => {
        res
          .status(201)
          .json({
            message: 'create question success',
            result
          })
      })
      .catch(err => {
        res
          .status(500)
          .json({
            message: 'something went wrong',
            err
          })
      })
  },
  readQuestion: (req, res) => {
    Question
      .find()
      .populate('owner')
      .exec()
      .then(questions => {
        res
          .status(200)
          .json({
            message: 'read questions success',
            questions
          })
      })
      .catch(err => {
        res
          .status(500)
          .json({
            message: 'something went wrong',
            err
          })
      })
  },
  upVoteQuestion: (req, res) => {
    let { id } = req.params
    let { owner } = req.body

    Question
      .findOneAndUpdate({
        _id: id
      }, {
        $push: {
          upVotes: owner
        },
        $pull: {
          downVotes: owner
        }
      })
      .then(questionUpdated => {
        res
          .status(200)
          .json({
            message: 'update question success',
            questionUpdated
          })
      })
      .catch(err => {
        res
          .status(500)
          .json({
            message: 'something went wrong',
            err
          })
      })
  },
  downVoteQuestion: (req, res) => {
    let { id } = req.params
    let { owner } = req.body

    Question
      .findOneAndUpdate({
        _id: id
      }, {
        $push: {
          downVotes: owner
        },
        $pull: {
          upVotes: owner
        }
      })
      .then(questionUpdated => {
        res
          .status(200)
          .json({
            message: 'update question success',
            questionUpdated
          })
      })
      .catch(err => {
        res
          .status(500)
          .json({
            message: 'something went wrong',
            err
          })
      })
  },
  deleteQuestion: (req, res) => {
    let { id } = req.params
    let { owner } = req.headers

    User
      .findOne({
        _id: owner
      })
      .then(user => {
        let indexQuestion = user.questions.indexOf(id)

        user.questions.splice(indexQuestion, 1)

        User
          .update({
            _id: owner
          },
            user
          )
          .then(userUpdated => {
            Question
              .findOneAndRemove({
                _id: id
              })
              .then(deletedQuestion => {
                Answer
                  .deleteMany({
                    questionId: id
                  })
                  .then(deletedAnswer => {
                    res
                      .status(200)
                      .json({
                        message: 'delete question success',
                        userUpdated,
                        deletedQuestion,
                        deletedAnswer
                      })
                  })
              })
          })
      })
      .catch(err => {
        res
          .status(500)
          .json({
            message: 'something went wrong',
            err
          })
      })
  }
}