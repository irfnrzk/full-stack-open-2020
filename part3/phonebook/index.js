const express = require('express')
const moment = require('moment')
const morgan = require('morgan')

const app = express()
app.use(express.json())

morgan.token('body', (req, res) => req.method === 'POST' ? JSON.stringify(req.body) : null)
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens['body'](req, res)
  ].join(' ')
}))

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

app.use(express.static('build'))

// app.get('/', (request, response) => {
//   response.send('<h1>Hello World!</h1>')
// })

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// 3.3
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }

})

// 3.4
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  const person = persons.find(person => person.id === id)

  if (person) {
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
  } else {
    response.status(404).end()
  }

})

// 3.5
app.post('/api/persons', (request, response) => {
  const body = request.body
  // console.log(body)

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(403).send({ error: 'name must be unique' })
  }

  if (body.name === '' || body.number === '') {
    return response.status(403).send({ error: 'name and number cannot be empty' })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: getRandomInt(99999)
  }

  persons = persons.concat(person)
  response.json(persons)

})

app.put('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    person.number = request.body.number
    response.json(person)
  } else {
    response.status(404).end()
  }

})

app.get('/info', (request, response) => {
  const timestamp = moment().format("ddd MMM D HH:mm:ss Z");

  response.send('<p>Phonebook has info for ' + persons.length + ' people</p><p>' + timestamp + '</p>')
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})