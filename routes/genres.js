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

router.post("/", (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({
    name: req.body.name,
  });
  try{
    const result = await genre.save();
    res.send(result);
  }
  catch(ex){
    res.send(ex.message);
  }
});

router.put("/:id", async (req, res) => {
  const genre = await Genre.find({_id: parseInt(req.params.id)})
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  genre.name = req.body.name;
  try{
    const result = await genre.save()
    res.send(result);
  }
  catch(ex){
    res.send(ex.message);
  }
});

router.delete("/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  const index = genres.indexOf(genre);
  genres.splice(index, 1);

  res.send(genre);
});

router.get("/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
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
