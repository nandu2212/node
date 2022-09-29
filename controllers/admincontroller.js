const asyncHandler = require('express-async-handler')

// Require-verifyPassword
const { verifyPassword } = require('../utilities/verifypassword')

// Reaquire-generateToken
const { generateToken } = require('../utilities/generatetoken')

// Require-UserModel
const adminModel = require('../model/customermodel')

// Require-category-model
const categoryModel = require('../model/cateogorymodel')

// Require-user-model
const UserModel = require('../model/customermodel')

// Require-pagination
const { pagination } = require('../../middleware/paginationMiddleware')

// AdminLogin
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400)
    throw new Error('Email and Password required')
  }

  // check-email
  const admin = await adminModel.findOne({
    $and: [{ email: email }, { role: process.env.ROLE_ADMIN }],
  })
  console.log('admin', admin)
  if (!admin) {
    res.status(400)
    throw new Error('Invalid Email')
  }

  // check-password
  const passwordMatch = await verifyPassword(password, admin.password)
  if (!passwordMatch) {
    res.status(400)
    throw new Error('Invalid Password')
  }
  res.status(200).json({
    name: admin.name,
    email: admin.email,
    phoneNumber: admin.phoneNumber,
    token: generateToken(admin._id),
  })
})

// Add-category
const addCategory = asyncHandler(async (req, res) => {
  const { categoryName } = req.body
  if (!categoryName) {
    res.status(400)
    throw new Error('categoryName required')
  }
  const category = await categoryModel.create({
    categoryName: categoryName,
  })
  if (category) {
    res.status(201).json({
      categoryName: category.categoryName,
    })
  }
})

// Get-all-categories
const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryModel.find()
  if (!categories) {
    res.status(403)
    throw new Error('No categories available')
  }
  res.status(200).json(categories)
})

// Get-all-users
const getAllUsers = asyncHandler(async (req, res) => {
  const user = await UserModel.find({ role: process.env.ROLE_USER })
  if (!user) {
    res.status(403)
    throw new Error('NO user found')
  }
  let { page, limit } = req.query
  if (!page) page = 1
  if (!limit) limit = 10
  const users = await pagination(user, page, limit)
  res.status(200).json(users)
})

// User-block-and-unblock
const userStatusUpdate = asyncHandler(async (req, res) => {
  const { userId } = req.query
  if (!userId) {
    res.status(400)
    throw new Error('userId is Required')
  }
  const user = await UserModel.findByIdAndUpdate(userId, req.body)
  if (!user) {
    res.status(403)
    throw new Error('User Not found')
  }
  res.status(200).json(user)
})
module.exports = {
  adminLogin,
  addCategory,
  getCategories,
  getAllUsers,
  userStatusUpdate,
}
