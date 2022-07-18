'use strict'
const mongoose = require('mongoose');

const journeySchema = mongoose.Schema({
    name: String,
    date: { type: Date, default: Date.now()},
    match: [{
        team1: { type: mongoose.Schema.ObjectId, ref: 'Team' },
        score1: Number,
        team2: { type: mongoose.Schema.ObjectId, ref: 'Team' },
        score2: Number,
    }]
});

module.exports = mongoose.model('Journey', journeySchema);