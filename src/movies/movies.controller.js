const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { response } = require("express");

//middleware
async function validMovie (req, res, next){
    const { movieId } = req.params;
    //theaters route
    if(req.originalUrl.includes("theaters")){
        const movieAndTheaters = await service.readMoviesAndTheaters(movieId);
        if(movieAndTheaters){
            res.locals.movie = movieAndTheaters;
            return next();
        }
        // reviews route
    } else if (req.originalUrl.includes("reviews")) {
        const movieAndReviews = await service.readMovieAndReviews(movieId);
        if (movieAndReviews) {
          res.locals.movie = movieAndReviews;
          return next();
        }
        // movieId route
    } else {
        const movie = await service.read(movieId);
        if (movie) {
          res.locals.movie = movie;
          return next();
        }
    }
    // invalid movie
    return next({
        status: 404,
        message: "Movie cannot be found.",
    });
}

// crudl
function read(req, res, next){
    res.json({ data: res.locals.movie })
}

async function list(req, res, next){
    const query = req.query.is_showing;
    if(!query) {
        listMovies(req, res, next);
    } else if (query == "true"){
        listMoviesInTheaters(req, res, next)
    }
}

async function listMovies(req, res, next) {
    const allMovies = await service.listAllMovies();
    res.json({ data: allMovies });
}

async function listMoviesInTheaters(req, res, next){
    const moviesInTheaters = await service.listByShowing();
    res.json({ data: moviesInTheaters });
}


module.exports = {
    read: [asyncErrorBoundary(validMovie), read],
    list,
};