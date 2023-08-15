// It's important that dotenv gets imported before the Person model is imported.
require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  console.error(error.name)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(express.static('build'))
// Don't foget this
app.use(express.json())
app.use(cors())
//app.use(requestLogger)
morgan.token('post-body', (req) => {
  if(req.method === 'POST'){return JSON.stringify(req.body)}
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-body'))

app.get('/', (request, response) => {
  response.send('<h1>Phonebook Server</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    const currentDate = new Date()
    const num = persons.length
    response.send(`Phonebook has info for ${num} people</br>${currentDate}`)
  })
})

// We can define parameters for routes in express by using the colon syntax:
// don't foget to add next argument in the callback
app.get('/api/persons/:id', (request, response, next) => {
  // The id parameter in the route of a request can be accessed through the request object:
  // the id accessed from the request is string
  console.log(request.params.id) //id is Str
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)}
    // if the id is not in the database
    else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  /*
    if (body.name === undefined || body.number === undefined) {
      return response.status(400).json({
        error: 'name or number missing'
      })
    }
    */
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save().then(savePerson => {
    console.log('save to the database...')
    response.json(savePerson)
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  //const body = request.body
  const { name, number } = request.body
  /*
  const person = {
    name: body.name,
    number: body.number,
  }
  */

  Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)


// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})