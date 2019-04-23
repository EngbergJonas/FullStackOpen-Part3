require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

app.use(bodyParser.json());
app.use(cors());
app.use(express.static("build"));

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

app.get("/api", (req, res) => {
  Person.find({})
    .then(persons => {
      res.send(
        `<p>Puhelinluettelossa on ${persons.length} henkilöä.</p>
    <p>${Date()}</p>`
      );
    })
    .catch(error => next(error));
});

app.get("/api/persons", (req, res) => {
  Person.find({})
    .then(persons => {
      res.json(persons.map(person => person.toJSON()));
    })
    .catch(error => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person.toJSON());
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end();
    })
    .catch(error => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON());
    })
    .catch(error => next(error));
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({ error: "content missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number
  });

  console.log(`Person: ${person}`);

  person
    .save()
    .then(savedPerson => {
      res.json(savedPerson.toJSON());
    })
    .catch(error => next(error));
});

const unknownEndPoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndPoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);
  if (error.name === "CastError" && error.kind == "ObjectId") {
    return res.status(400).send({ error: "malformatted id" });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
