const express = require('express')
const router = express.Router()

const {
  userSighup,
  userLogin,
  updateUser,
  getAllProducts,
} = require('../controllers/customercontroller')

const { protect } = require('../middleware/authoriztion')

// user-signUp
router.post('/signup', userSighup)

// user-Login
router.post('/login', userLogin)

// update-user
router.put('/update', protect, updateUser)

// get-all-products
router.get('/product', protect, getAllProducts)

module.exports = router
