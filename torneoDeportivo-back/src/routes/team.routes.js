'use strict'

const express = require('express');
const api = express.Router();
const midAuth = require('../services/auth');
const teamController = require('../controllers/team.controller');

//*ADMIN
api.get('/testTeam', [midAuth.ensureAuth, midAuth.isAdmin], teamController.testTeam);

api.post('/addTeam_OnlyAdmin', [midAuth.ensureAuth, midAuth.isAdmin], teamController.addTeam_OnlyAdmin);

api.post('/getTeam_OnlyAdmin/:id', [midAuth.ensureAuth, midAuth.isAdmin], teamController.getTeam_OnlyAdmin);
api.post('/getTeams_OnlyAdmin', [midAuth.ensureAuth, midAuth.isAdmin], teamController.getTeams_OnlyAdmin);

api.put('/updateTeam_OnlyAdmin/:id', [midAuth.ensureAuth, midAuth.isAdmin], teamController.updateTeam_OnlyAdmin);

api.delete('/deleteTeam_OnlyAdmin/:id', [midAuth.ensureAuth, midAuth.isAdmin], teamController.deleteTeam_OnlyAdmin);

api.post('/createChart_OnlyAdmin', midAuth.ensureAuth, teamController.createChart_OnlyAdmin);

//*ALL ROLES
api.post('/addTeam/:league', midAuth.ensureAuth, teamController.addTeam);

api.get('/getTeam/:league/:id', midAuth.ensureAuth, teamController.getTeam);
api.get('/getTeams/:league', midAuth.ensureAuth, teamController.getTeams);

api.put('/updateTeam/:league/:id', midAuth.ensureAuth, teamController.updateTeam);

api.delete('/deleteTeam/:league/:id', midAuth.ensureAuth, teamController.deleteTeam);

api.get('/createChart/:league', midAuth.ensureAuth, teamController.createChart);

module.exports = api;