const router = require('express').Router()
const { loginAuthentication } = require('../middlewares/auth')
const { createAnswer, readAnswer, upVoteAnswer, downVoteAnswer, deleteAnswer } = require('../controllers/answer.controller')

router.post('/', loginAuthentication, createAnswer)
      .get('/', readAnswer)
      .put('/upvote/:id', loginAuthentication, upVoteAnswer)
      .put('/downvote/:id', loginAuthentication, downVoteAnswer)
      .delete('/delete/:id', loginAuthentication, deleteAnswer)

module.exports = router