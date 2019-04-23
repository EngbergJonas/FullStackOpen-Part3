const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose.connect(url, { newUrlParser: true }).then(result => {
    console.log('connect to MongoDB')
}).catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
})

const personSchema = new mongoose.Schema({
    name: String,
    number: String
  });

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)