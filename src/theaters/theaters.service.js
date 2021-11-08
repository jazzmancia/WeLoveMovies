const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

const configuration = reduceProperties("theater_id", {
    movie_id: ["movies", null, "movie_id"],
    title: ["movies", null, "title"],
    rating: ["movies", null, "rating"],
    runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
});

function list(){
    return knex("theaters as t")
    .join("movies_theaters as mt", "mt.theater_id", "t.theater_id")
    .join("movies as m", "m.movie_id", "mt.movie_id")
    .select("t.*", "m.*")
    .where({"mt.is_showing": true})
    .then(configuration);
}

module.exports = {
    list,
};