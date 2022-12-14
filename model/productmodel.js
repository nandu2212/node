const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const productSchema = mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: ObjectId,
      ref: 'Category',
    },
    productImage: {
      type: String,
      default: null,
    },
  },
  {
    timestamp: true,
  },
)

module.exports = mongoose.model('Product', productSchema)
