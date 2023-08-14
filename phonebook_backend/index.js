const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(cors())

morgan.token('post-body', (req, res) => { 
    if(req.method === "POST"){return JSON.stringify(req.body)}
    })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-body'))
// Don't foget this
app.use(express.json())
app.use(express.static('build'))

const mongoose = require('mongoose')
const password = "Ct9lYDzfNvy98GKj"
// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url =
  `mongodb+srv://meiqimwen:${password}@cluster0.tckg5kf.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String, // Use Number data type for integer-like values; but this place use String
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // Even though the _id property of Mongoose objects looks like a string, it is in fact an object.
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

//If you define a model with the name Person, mongoose will automatically name the associated collection as people.
const Person = mongoose.model('Person', personSchema)

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
    const id = Number(request.params.id)
    console.log(id)
    const person = persons.find(person => {
        return person.id === id
    })
    console.log(person)

    // The if-condition leverages the fact that all JavaScript objects are truthy,
    // undefined is falsy meaning that it will evaluate to false
    if (person) {
        response.json(person)
      } else {
        console.log("404")
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    console.log(`has deleted ${id}`)
    response.status(204).end()
})

const generateId = () => {
    const id = Math.round(Math.random()*100000000)
    if (!persons.find(person => person.id === id)){
        return id
    } else {
        return generateId()
    }
}
  
app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if (!body.name || !body.number) {
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

    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
})

app.use(unknownEndpoint)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})