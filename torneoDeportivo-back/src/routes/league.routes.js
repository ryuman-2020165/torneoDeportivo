'use strict'

const express = require('express');
const api = express.Router();
const midAuth = require('../services/auth');  
const leagueController = require('../controllers/league.controller');

//*ADMIN
api.get('/testLeague', [midAuth.ensureAuth, midAuth.isAdmin], leagueController.testLeague);

api.post('/addLeague_OnlyAdmin', [midAuth.ensureAuth, midAuth.isAdmin], leagueController.addLeague_OnlyAdmin);

api.get('/getLeague_OnlyAdmin/:id', [midAuth.ensureAuth, midAuth.isAdmin], leagueController.getLeague_OnlyAdmin);
api.get('/getLeagues_OnlyAdmin', [midAuth.ensureAuth, midAuth.isAdmin], leagueController.getLeagues_OnlyAdmin);

api.put('/updateLeague_OnlyAdmin/:id', [midAuth.ensureAuth, midAuth.isAdmin], leagueController.updateLeague_OnlyAdmin);

api.delete('/deleteLeague_OnlyAdmin/:id', [midAuth.ensureAuth, midAuth.isAdmin], leagueController.deleteLeague_OnlyAdmin);

//*ALL ROLES
api.post('/addLeague', midAuth.ensureAuth, leagueController.addLeague);

api.get('/getLeague/:id', midAuth.ensureAuth, leagueController.getLeague);
api.get('/getLeagues', midAuth.ensureAuth, leagueController.getLeagues);

api.put('/updateLeague/:id', midAuth.ensureAuth, leagueController.updateLeague);

api.delete('/deleteLeague/:id', midAuth.ensureAuth, leagueController.deleteLeague);

module.exports = api;