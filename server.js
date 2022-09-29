const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const mongoose=require('mongoose')
const swaggerJsDocs = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')
const { errorHandler } = require('./middleware/errorhandler')

// Require-Routes
const adminRoute = require('./routes/adminroute')
const userRoute = require('./routes/userroute')
const port = process.env.PORT || 5000

//databaseconnection
mongoose.connect("mongodb+srv://insta:insta@instagram.fcb6e.mongodb.net/?retryWrites=true&w=majority").then(()=> {
    console.log("connected to database")
}).catch((err)=> {
    console.log(err)
})

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Extended:https://swagger.id/specification/#infoObject
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FMCG APP',
      version: '1.0.0',
      description: 'A sinple Express Library API',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['./backend/server.js'],
}
const specs = swaggerJsDocs(options)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))

//Route-handling
app.use('/api/admin', adminRoute)
app.use('/api/user', userRoute)

// Error-Handling
app.use(errorHandler)

// Server-Listening
app.listen(port, () => console.log(`Server Started on port ${port}`))
