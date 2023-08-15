// It's important that dotenv gets imported before the Person model is imported. 
require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
const Person = require('./models/person')

app.use(cors())

morgan.token('post-body', (req, res) => { 
    if(req.method === "POST"){return JSON.stringify(req.body)}
    })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-body'))
// Don't foget this
app.use(express.json())
app.use(express.static('build'))


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Phonebook Server</h1>')
  })

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
})

app.get('/info', (request, response) => {
    const currentDate = new Date();
    const num = persons.length
    response.send(`Phonebook has info for ${num} people</br>${currentDate}`)
})

// We can define parameters for routes in express by using the colon syntax:
app.get('/api/persons/:id', (request, response) => {
    // The id parameter in the route of a request can be accessed through the request object:
    // the id accessed from the request is string
    console.log(request.params.id) //id is Str
    Person.findById(request.params.id).then(person => {
      console.log(person)
      response.json(person)
      //console.log("404")
      //response.status(404).end()
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    console.log(`has deleted ${id}`)
    response.status(204).end()
})
  
app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if (body.name === undefined || body.number === undefined) {
      return response.status(400).json({ 
        error: 'name or number missing' 
      })
    }
    
    const person_same_name = persons.find(person => person.name === body.name)
    if (person_same_name) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }
    
    const person = new Person({
      name: body.name,
      number: body.number,
    })
    person.save().then(savePerson => {
      console.log("save to the database...")
      response.json(savePerson)
    })
})

app.use(unknownEndpoint)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})