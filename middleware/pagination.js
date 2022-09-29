const asyncHandler = require('express-async-handler')

const pagination = async (allData, page, limit) => {
  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  const result = await allData.slice(startIndex, endIndex)
  return result
}

module.exports = { pagination }
