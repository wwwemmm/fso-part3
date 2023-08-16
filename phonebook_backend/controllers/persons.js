const personsRouter = require('express').Router()
const Person = require('../models/person')
const logger = require('../utils/logger')
personsRouter.get('/', (request, response) => {
  response.send('<h1>Phonebook Server</h1>')
})

personsRouter.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

personsRouter.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    const currentDate = new Date()
    const num = persons.length
    response.send(`Phonebook has info for ${num} people</br>${currentDate}`)
  })
})

// We can define parameters for routes in express by using the colon syntax:
// don't foget to add next argument in the callback
personsRouter.get('/api/persons/:id', (request, response, next) => {
  // The id parameter in the route of a request can be accessed through the request object:
  // the id accessed from the request is string
  logger.log(request.params.id) //id is Str
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

personsRouter.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

personsRouter.post('/api/persons', (request, response, next) => {
  const body = request.body
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save().then(savePerson => {
    //logger.log('save to the database...')
    response.json(savePerson)
  }).catch(error => next(error))
})

personsRouter.put('/api/persons/:id', (request, response, next) => {
  //const body = request.body
  const { name, number } = request.body

  Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


module.exports = personsRouter