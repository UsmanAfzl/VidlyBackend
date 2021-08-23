const express = require("express");
const router = express.Router();
const { Genre } = require("../models/genre");
const { Movie, validateMovie } = require("../models/movie");

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("title");
  if (movies) res.status(200).send(movies);
  res.status(200).send("There are no movies in the database.");
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) res.status(404).send("Movie with the given ID was not found");
  res.status(200).send(movie);
});

router.post("/", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) res.status(400).send("The genre with geven ID was not found");

  let movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  res.status(200).send(movie);
  movie = await movie.save();
});

router.put("/:id", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});
module.exports = router;
