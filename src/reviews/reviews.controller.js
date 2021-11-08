const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const VALID_REVIEW_PROPERTIES = ["score", "content"];

//middleware
async function validReviewId(req, res, next){
    const { reviewId } = req.params;
    const validReview = await service.read(reviewId);
    if (validReview) {
        res.locals.review = validReview;
        return next();
      } else {
        return next({
          status: 404,
          message: `Review cannot be found.`,
        });
      }
}

function bodyHasValidProperties(req, res, next){
    const { data = {} } = req.body;
    const invalidFields = Object.keys(data).filter(
      (field) => !VALID_REVIEW_PROPERTIES.includes(field)
    );
    if (invalidFields.length) {
      return next({
        status: 400,
        message: "Invalid fields",
      });
    }
    next();
}

// crudl
async function update(req, res, next) {
  const { reviewId } = req.params;
  const updatedReview = {
    ...res.locals.review,
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };

  await service.update(reviewId, updatedReview);
  const updatedWithCritics = await service.addCritics(reviewId);
  res.json({ data: updatedWithCritics });
}

async function destroy(req, res, next) {
  const { reviewId } = req.params;
  await service.destroy(reviewId)
  res.sendStatus(204);
}

module.exports = {
  update: [
    asyncErrorBoundary(validReviewId),
    bodyHasValidProperties,
    asyncErrorBoundary(update),
  ],
  delete: [
    asyncErrorBoundary(validReviewId),
    asyncErrorBoundary(destroy),
  ]
};