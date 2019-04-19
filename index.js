const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('build'))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "045-1234567"
  },
  {
    id: 2,
    name: "James Bond",
    number: "045-1234567"
  },
  {
    id: 3,
    name: "Joku Äijä",
    number: "045-1234567"
  }
];

morgan.token("person", function(req, res) {
  if (req.method == "POST") {
    return JSON.stringify(req.body);
  }
  return null;
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :person"
  )
);

app.get("/", (req, res) => {
  res.send("<h1>Hello world!</h1>");
});

app.get("/api", (req, res) => {
  const amount = persons.length;
  const date = new Date();
  res.send(`
    <p>Puhelinluettelossa on ${amount} henkilöä.</p>
    <p>${date}</p>`);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);
  res.status(204).end();
});

const generateId = id => {
  return Math.floor(Math.random() * Math.floor(id));
};

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number missing"
    });
  }
  if (persons.map(person => person.name === body.name).includes(true)) {
    return res.status(400).json({
      error: "name already exists"
    });
  }
  person = {
    id: generateId(1000),
    name: body.name,
    number: body.number
  };
  persons = persons.concat(person);

  res.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
