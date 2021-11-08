if (process.env.USER) require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");
const theatersRouter = require("./theaters/theaters.router");
const moviesRouter = require("./movies/movies.router");
const reviewsRouter = require("./reviews/reviews.router");

app.use(cors());

app.use(express.json());

app.use("/theaters", theatersRouter);
app.use("/movies", moviesRouter);
app.use("/reviews", reviewsRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
