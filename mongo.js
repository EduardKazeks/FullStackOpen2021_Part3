const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const phonenumber = process.argv[4]

const url = `mongodb+srv://admin:admin@cluster0.q8ibm.mongodb.net/FullStackOpen2021?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    phonenumber: String,
    id: Number,
})

const Person = mongoose.model('Person', personSchema)

if (name == undefined) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
          console.log(`${person.name} ${person.phonenumber} `)
        })
        mongoose.connection.close()
      })
} else {
    const person = new Person({
        name: name,
        phonenumber: phonenumber,
        id: 0,
    })
    
    person.save().then(response => {
      console.log(` added ${name} number ${phonenumber} to phonebook `)
      mongoose.connection.close()
    })
    
}