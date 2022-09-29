const jwt = require('jsonwebtoken')

const generateToken = (id) => {
  const options = {
    expiresIn: '12h',
  }
  return jwt.sign({ id }, process.env.JWT_ACCESS_TOKEN_SECRET, options)
}

module.exports = { generateToken }
