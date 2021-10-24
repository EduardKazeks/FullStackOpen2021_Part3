const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

app.use(
    morgan(':method :url :status :res[content-length] :body - :response-time ms')
)
morgan.token('body', function (request, response) { return JSON.stringify(request.body) })

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

const baseUrl = '/api/persons'

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }

  app.use(requestLogger)

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

  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${new Date()} </p>`)
  })

  const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(p => p.id))
      : 0
    return maxId + 1
  }
  
  app.post('/api/persons', (request, response) => {       // Need to use Math.random method in post request.
    const body = request.body
  
    if (!body.name || !body.phonenumber) {
      return response.status(400).json({ 
        error: 'name or number missing' 
      })
    }
  
    const person = {
      name: body.name,
      phonenumber: body.phonenumber || false,
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })
  
  app.get('/api/persons/:id', (request, response, next) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
      } else {
        response.status(400).send({ error: 'malformatted id' })
      }
     })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)


  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })