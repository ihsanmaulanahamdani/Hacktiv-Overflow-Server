const mongoose = require('mongoose')
const Answer   = require('../models/answer')
const Question = require('../models/question')
const User     = require('../models/user')

module.exports = {
  createAnswer: (req, res) => {
    let { answer, owner, questionId } = req.body

    console.log(answer, owner, questionId, '==============');

    let newAnswer = new Answer({
      answer,
      owner,
      questionId,
      upVotes: [],
      downVotes: []
    })

    newAnswer
      .save()
      .then(result => {
        res
          .status(201)
          .json({
            message: 'create anwser success',
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
  readAnswer: (req, res) => {

    Answer
      .find()
      .populate('owner')
      .populate('questionId')
      .exec()
      .then(answers => {
        res
          .status(200)
          .json({
            message: 'read answers success',
            answers
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
  upVoteAnswer: (req, res) => {
    let { id } = req.params
    let { owner } = req.body

    Answer
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
      .then(answerUpdated => {
        res
          .status(200)
          .json({
            message: 'update answer success',
            answerUpdated
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
  downVoteAnswer: (req, res) => {
    let { id } = req.params
    let { owner } = req.body

    Answer
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
      .then(answerUpdated => {
        res
          .status(200)
          .json({
            message: 'update answer success',
            answerUpdated
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
  deleteAnswer: (req, res) => {
    let { id } = req.params
    let { owner, questionid } = req.headers

    console.log(req.headers);

    User
      .findOne({
        _id: owner
      })
      .then(user => {
        console.log(user, 'user')
        let indexAnswer = user.answers.indexOf(id)

        user.answers.splice(indexAnswer, 1)

        User
          .update({
            _id: owner
          },
            user
          )
          .then(userUpdated => {
            console.log(questionid, 'idddddd');
            Question
              .findOne({
                _id: questionid
              })
              .then(question => {
                console.log(question, 'question')
                let indexAnswer = question.answers.indexOf(id)

                question.answers.splice(indexAnswer, 1)

                Question
                  .update({
                    _id: questionid
                  },
                    question
                  )
                  .then(questionUpdated => {
                    Answer
                      .findOneAndRemove({
                        _id: id
                      })
                      .then(deletedAnswer => {
                        res
                          .status(200)
                          .json({
                            message: 'delete answer success',
                            deletedAnswer
                          })
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