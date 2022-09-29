const bcrypt = require('bcryptjs')

const verifyPassword = async (password, hashPassword) => {
  return await bcrypt.compare(password, hashPassword)
}
module.exports = { verifyPassword }
