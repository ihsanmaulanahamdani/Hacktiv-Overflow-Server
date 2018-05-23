const router = require('express').Router()
const { loginAuthentication } = require('../middlewares/auth')
const { createQuestion, readQuestion, upVoteQuestion, downVoteQuestion, deleteQuestion } = require('../controllers/question.controller')

router.post('/', loginAuthentication, createQuestion)
      .get('/', readQuestion)
      .put('/upvote/:id', loginAuthentication, upVoteQuestion)
      .put('/downvote/:id', loginAuthentication, downVoteQuestion)
      .delete('/delete/:id', loginAuthentication, deleteQuestion)

module.exports = router