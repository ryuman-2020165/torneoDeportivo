'use strict'
const mongoose = require('mongoose');

const leagueSchema = mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    name: String,
    country: String,
    teams: [{ type: mongoose.Schema.ObjectId, ref: 'Team' }],
    journeys: [{ type: mongoose.Schema.ObjectId, ref: 'Journey' }]
});

module.exports = mongoose.model('League', leagueSchema);
