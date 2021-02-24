const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

const Genre = new mongoose.model("Genre", genreSchema);

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort({ name: 1 });
  res.send(genres);
});

router.post("/", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({
    name: req.body.name,
  });
  try {
    const result = await genre.save();
    res.send(result);
  } catch (ex) {
    res.send(ex.message);
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const genre = await Genre.findById(parseInt(req.params.id));
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  genre.name = req.body.name;
  try {
    const result = await genre.save();
    res.send(result);
  } catch (ex) {
    res.send(ex.message);
  }
});

router.delete("/:id", async (req, res) => {
  const genre = await Genre.findById(parseInt(req.param.id));
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");
  try {
    const result = await genre.delete();
    res.send(result);
  } catch (ex) {
    res.send(ex.message);
  }
});

router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(parseInt(req.params.id));
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");
  res.send(genre);
});

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(genre, schema);
}

module.exports = router;
