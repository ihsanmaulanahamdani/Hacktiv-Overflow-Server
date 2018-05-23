const router = require('express').Router()
const { login, register }   = require('../controllers/index.controller')

router.post('/register', register)
      .post('/login', login)

module.exports = router