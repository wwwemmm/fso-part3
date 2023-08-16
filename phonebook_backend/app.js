// config should be imported before the Person model is imported.
const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const personsRouter = require('./controllers/persons')
const middleware = require('./utils/middleware')
const morgan = require('morgan')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
logger.info('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
// Don't foget this
app.use(express.json())
//app.use(requestLogger)

app.use(morgan(middleware.morganFormat, { postBody: middleware.customPostBodyToken }))
app.use('', personsRouter)


app.use(middleware.unknownEndpoint)
// this has to be the last loaded middleware.
app.use(middleware.errorHandler)

module.exports = app
/*
//const PORT = process.env.PORT || 3001
app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
*/