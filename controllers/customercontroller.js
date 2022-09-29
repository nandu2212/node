const asyncHandler = require('express-async-handler')

// Require-user-Model
const userModel = require('../model/customermodel')

// Require-product-model
const ProductModel = require('../model/productmodel')

// Require-bcryptPassword-function
const { bcryptPassword } = require('../utilities/hashpassword')

// Require-verify-password
const { verifyPassword } = require('../utilities/verifypassword')

// Require-Generate-token
const { generateToken } = require('../utilities/generatetoken')

// pagination
const { pagination } = require('../middleware/pagination')

// Sigh-up-user
const userSighup = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, password } = req.body
  console.log('data', req.body)
  if (!name || !email || !phoneNumber || !password) {
    res.status(400)
    throw new Error('Provide all details')
  }

  // check-if-user-exists
  const userExist = await userModel.find({ email })
  if (!userExist) {
    res.status(400)
    throw new Error('User Alredy Exists')
  }
  const hashedPassword = await bcryptPassword(password)

  const newUser = await userModel.create({
    name: name,
    email: email,
    phoneNumber: phoneNumber,
    password: hashedPassword,
  })

  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
    phoneNumber: newUser.phoneNumber,
    token: generateToken(newUser._id),
  })
})

// Login-user
const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400)
    throw new Error('Email and password required')
  }
  // check-email
  const user = await userModel.findOne({
    $and: [{ email: email }, { role: process.env.ROLE_USER }],
  })
  if (!user) {
    res.status(400)
    throw new Error("Can't find any user with this email")
  }
  //   check-user-status
  if (!user.status) {
    res.status(401)
    throw new Error('Your Account has been blocked')
  }
  // check-password
  const passwordMatch = await verifyPassword(password, user.password)
  if (!passwordMatch) {
    res.status(400)
    throw new Error('Invalid Password')
  }

  res.status(200).json({
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    token: generateToken(user._id),
  })
})

// updateUser
const updateUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id
  const updatedUser = await userModel.findByIdAndUpdate(userId, req.body)
  if (updateUser) {
    res.status(200).json({
      name: updatedUser.name,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      token: generateToken(updateUser._id),
    })
  }
})

// get-products
const getAllProducts = asyncHandler(async (req, res) => {
  const { category, price, name } = req.query
  let filter = {}
  if (category) {
    filter.category = category
  }
  if (price) {
    filter.price = price
  }
  if (name) {
    filter.productName = name
  }
  const Allproducts = await ProductModel.find(filter).populate({
    path: 'category',
    select: ['categoryName'],
  })

  let { page, limit } = req.query
  if (!page) page = 1
  if (!limit) limit = 10
  console.log('daa', page, limit)
  const products = await pagination(Allproducts, page, limit)
  if (!products) {
    res.status(403)
    throw new Error('products not found')
  }
  res.status(200).json(products)
})
module.exports = { userSighup, userLogin, updateUser, getAllProducts }
