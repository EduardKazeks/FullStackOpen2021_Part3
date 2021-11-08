const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()
const Person = require('./models/person')
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

// GET REQUEST
app.get(baseUrl, (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})
// GET INFO
app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${new Date()} </p>`)
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(p => p.id))
    : 0
  return maxId + 1
}
// POST REQUEST
app.post(baseUrl, (request, response, next) => {    
  const body = request.body
  
  if (!request.body.name || !request.body.number) {
    return response.status(400).json({ error: 'name or number missing' })
  }
  
  const person = new Person({
    name: body.name,
    number: body.number || false,
  })
  person
    .save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedAndFormattedPerson => {
      response.json(savedAndFormattedPerson)
    })
    .catch(error => next(error))
})
// GET REQUEST
app.get(`${baseUrl}/:id`, (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
    .catch(error => next(error))
})
// PUT REQUEST
app.put(`${baseUrl}/:id`, (request, response, next) => {
  const body = request.body
  
  const person = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})
// DELETE REQUEST
app.delete(`${baseUrl}/:id`, (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)
// ErrorHandler
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})