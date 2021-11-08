const service = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//list 
async function list(req, res){
    const theatersList = await service.list();
    res.json({ data: theatersList })
}

module.exports = { 
    list: asyncErrorBoundary(list),
}