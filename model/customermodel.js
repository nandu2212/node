const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: Number,
    },
    status: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: 'user',
    },
  },
  {
    timestamp: true,
  },
)

module.exports = mongoose.model('User', userSchema)
