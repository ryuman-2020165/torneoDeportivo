'use strict'

const express = require('express');
const api = express.Router();
const midAuth = require('../services/auth');
const journeyController = require('../controllers/journey.controller');

//*ADMIN
api.get('/testJourney', [midAuth.ensureAuth, midAuth.isAdmin], journeyController.testJourney);

api.get('/getJourney_OnlyAdmin/:id', [midAuth.ensureAuth, midAuth.isAdmin], journeyController.getJourney_OnlyAdmin);
api.get('/getJourneys_OnlyAdmin', [midAuth.ensureAuth, midAuth.isAdmin], journeyController.getJourneys_OnlyAdmin);

api.put('/updateJourney_OnlyAdmin/:id', [midAuth.ensureAuth, midAuth.isAdmin], journeyController.updateJourney_OnlyAdmin);

api.post('/addMatch_OnlyAdmin/:id', [midAuth.ensureAuth, midAuth.isAdmin], journeyController.addMatch_OnlyAdmin);

api.get('/getMatch_OnlyAdmin/:id', [midAuth.ensureAuth, midAuth.isAdmin], journeyController.getMatch_OnlyAdmin);
api.get('/getMatches_OnlyAdmin', [midAuth.ensureAuth, midAuth.isAdmin], journeyController.getMatches_OnlyAdmin);

api.put('/updateMatch_OnlyAdmin/:id', [midAuth.ensureAuth, midAuth.isAdmin], journeyController.updateMatch_OnlyAdmin);

api.delete('/deleteMatch_OnlyAdmin/:id', [midAuth.ensureAuth, midAuth.isAdmin], journeyController.deleteMatch_OnlyAdmin);

//*ALL ROLES
api.get('/getJourney/:league/:id', midAuth.ensureAuth, journeyController.getJourney);
api.get('/getJourneys/:league', midAuth.ensureAuth, journeyController.getJourneys);

api.put('/updateJourney/:league/:id', midAuth.ensureAuth, journeyController.updateJourney);

api.post('/addMatch/:league/:id', midAuth.ensureAuth, journeyController.addMatch);

api.get('/getMatch/:league/:journey/:id', midAuth.ensureAuth, journeyController.getMatch);
api.get('/getMatches/:league/:journey', midAuth.ensureAuth, journeyController.getMatches);

api.put('/updateMatch/:league/:journey/:id', midAuth.ensureAuth, journeyController.updateMatch);

api.delete('/deleteMatch/:league/:journey/:id', midAuth.ensureAuth, journeyController.deleteMatch);

module.exports = api;