const asyncHandler = require('express-async-handler')

// Require-ProductModel
const ProductModel = require('../model/productmodel')

// Require-pagination
const { pagination } = require('../middleware/pagination')

// Add-product
const addProduct = asyncHandler(async (req, res) => {
  const { productName, price, category, productImage } = req.body
  if (!productName || !price || !category) {
    res.status(400)
    throw new Error('Product details required')
  }
  const product = await ProductModel.create(req.body)
  if (!product) {
    res.status(400)
    throw new Error('Product not added')
  }
  res.status(201).json(product)
})

// Get-all-products
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

// Update-Products
const updateProduct = asyncHandler(async (req, res) => {
  const { proId } = req.query
  if (!proId) {
    res.status(403)
    throw new Error('product Id is required')
  }
  const product = await ProductModel.findByIdAndUpdate(proId, req.body)
  if (!product) {
    res.status(403)
    throw new Error('product not found')
  }
  res.status(200).json(product)
})

// Delete-Product
const deleteProduct = asyncHandler(async (req, res) => {
  const { proId } = req.query
  if (!proId) {
    res.status(403)
    throw new Error('productId is required')
  }
  const product = await ProductModel.findById(proId)
  if (!product) {
    res.status(403)
    throw new Error('product not found')
  }
  await product.remove()

  res.status(200).json({ id: proId })
})
module.exports = { addProduct, getAllProducts, updateProduct, deleteProduct }
