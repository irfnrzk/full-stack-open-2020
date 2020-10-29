const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[5]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.sqszd.mongodb.net/persons?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number,
})

const Person = mongoose.model('Person', personSchema)

// console.log(process.argv.length)

if (process.argv.length > 3) {
  const person = new Person({
    "name": name || "Arto Hellas",
    "number": number || "040-123456",
    // "id": number || 1
  })

  person.save().then(result => {
    console.log(`Added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  Person
    .find({})
    .then(persons => {
      console.log('phonebook:');
      persons.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
}