const express = require('express')
const router = express.Router()

const {
  adminLogin,
  addCategory,
  getCategories,
  getAllUsers,
  userStatusUpdate,
} = require('../controllers/admincontroller')
const {
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require('../controllers/productcontroller')

const { protect, authRole } = require('../middleware/authoriztion')

// Admin-Login
router.post('/login', adminLogin)

// Add-category
router.post('/category', protect, authRole, addCategory)

// Get-all-category
router.get('/category', protect, authRole, getCategories)

// Add-product
router.post('/product', protect, authRole, addProduct)

// Get-all-products
router.get('/product', protect, authRole, getAllProducts)

// Update-product
router.put('/product/update', protect, authRole, updateProduct)

// Delete-product
router.delete('/product/delete', protect, authRole, deleteProduct)

// List-all-users
router.get('/user', protect, authRole, getAllUsers)

// User-block/Unblock
router.put('/user', protect, authRole, userStatusUpdate)

module.exports = router
