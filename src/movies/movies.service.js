const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

//nest critics into movies
const addCritic = mapProperties({
    critic_id: "critic.critic_id",
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
    created_at: "critic.created_at",
    updated_at: "critic.updated_at",
  });

function listAllMovies(){
    return knex("movies").select("*");
}

function listByShowing(){
    return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select("m.movie_id", "m.title", "m.rating", "m.description", "m.image_url")
    .where({ "mt.is_showing": true })
    .groupBy("m.movie_id")
    .orderBy("m.movie_id");
}

function read(movieId){
    return knex("movies as m")
    .select("*")
    .where({ "m.movie_id": movieId })
    .first()
}

function readMoviesAndTheaters(movieId){
    return knex("movies as m")
    .join("movies_theaters as mt", "mt.movie_id", "m.movie_id")
    .join("theaters as t", "mt.theater_id", "t.theater_id")
    .select("t.*", "m.movie_id")
    .where({
      "mt.is_showing": true,
      "m.movie_id": movieId,
    });
}

function readMovieAndReviews(movieId){
    return knex("reviews as r")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .select("r.*", "c.*")
    .where({
      "r.movie_id": movieId,
    })
    .then((reviews) => reviews.map(review => addCritic(review)));
}


module.exports = {
    listAllMovies,
    listByShowing,
    readMoviesAndTheaters,
    readMovieAndReviews,
    read,
};