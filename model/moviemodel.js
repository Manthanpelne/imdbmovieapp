const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    name: {type: String, required: true},
    img: {type: String, required: true},
    year: {type: Number, required: true},
    genre: {type: [String], required: true},
    rating: {type: Number, required: true}
});

const movieModel = mongoose.model("movie", movieSchema);
module.exports = {movieModel}