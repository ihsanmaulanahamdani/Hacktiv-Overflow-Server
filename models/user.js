const bcrypt   = require('bcryptjs')
const mongoose = require('mongoose')
const Schema   = mongoose.Schema

let userSchema = new Schema({
  name: {
    type: String,
    required: [ true, 'please input your name' ]
  },
  email: {
    type: String,
    unique: [ true, 'email is already used' ],
    validate: {
      validator: (email) => {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(email).toLowerCase());
      },
      message: 'email format is wrong'
    },
    required: [ true, 'please input your email' ]
  },
  password: {
    type: String,
    validate: {
      validator: (password) => {
        return new Promise((resolve, reject) => {
          if (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.test(String(password))) {
            resolve()
          } else {
            let statusMessage = 'password at least 8 characters and contains at least one number, one uppercase and one lowercase'

            reject(statusMessage)
          }
        })
      }
    }
  },
  questions: [{
    type: Schema.Types.ObjectId,
    ref: 'Question'
  }],
  answers: [{
    type: Schema.Types.ObjectId,
    ref: 'Answer'
  }]
}, {
  timestamps: true
})

userSchema.pre('save', function (next) {
  let user = this

  bcrypt.genSalt(10, function (errSalt, salt) {
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (!err) {
        user.password = hash
        next()
      } else {
        next(err)
      }
    })
  })
})

userSchema.methods.compareHash = (password, hash, callback) => {
  bcrypt.compare(password, hash, (err, result) => {
    if (!err) {
      callback(null, result)
    } else {
      callback(err, null)
    }
  })
}

let User =mongoose.model('User', userSchema)

module.exports = User