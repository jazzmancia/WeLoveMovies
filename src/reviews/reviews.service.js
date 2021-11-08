const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

//add critic properties to reviews table
const addCritic = mapProperties({
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

function read(reviewId) {
  return knex("reviews")
    .select("*")
    .where({ review_id: reviewId })
    .first();
}

function update(reviewId, updatedReview) {
  return knex("reviews")
    .where({ review_id: reviewId })
    .update(updatedReview);
}

function addCritics(reviewId) {
  return knex("reviews as r")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .where({ review_id: reviewId })
    .first()
    .then(addCritic);
}

function destroy(reviewId) {
  return knex("reviews")
    .where({ review_id: reviewId })
    .del();
}

module.exports = {
  addCritics,
  read,
  update,
  destroy,
};