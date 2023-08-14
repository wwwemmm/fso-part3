const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

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
module.exports = mongoose.model('Person', personSchema)