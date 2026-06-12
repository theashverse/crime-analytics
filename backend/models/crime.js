const mongoose = require("mongoose");

const crimeSchema = new mongoose.Schema({
    state: String,
    year: Number,
    total_cases: Number,
    crime_type: String
});

module.exports = mongoose.model("crime", crimeSchema, "crimes");