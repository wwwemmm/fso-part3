const express = require('express')
const app = express()
const morgan = require('morgan')

morgan.token('post-body', (req, res) => { 
    if(req.method === "POST"){return JSON.stringify(req.body)}
    })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-body'))
// Don't foget this
app.use(express.json())

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
    response.json(persons)
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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})