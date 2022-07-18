'use strict'
const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
    name: String,
    country: String,
    proGoals: Number,
    againstGoals: Number,
    differenceGoals: Number,
    playedMatches: Number,
});

module.exports = mongoose.model('Team', teamSchema);