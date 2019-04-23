const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("anna salasana");
  process.exit(1);
}
if (process.argv.length === 4) {
  console.log("nimi tai numero puuttuu");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://fullstackjonas:${password}@cluster0-s6ief.mongodb.net/puhelinluettelo?retryWrites=true`;

mongoose.connect(url, { useNewUrlParser: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: name,
  number: number
});

if (process.argv.length === 5) {
  person.save().then(response => {
    console.log(`lisätään ${name} numero ${number} luetteloon`);
    mongoose.connection.close();
    process.exit(1);
  });
} else if (process.argv.length === 3) {
  console.log("Puhelinluettelo:");
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
    process.exit(1);
  });
}
