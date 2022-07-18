'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const app = express();

const userRoutes = require('../src/routes/user.routes');
const teamRoutes = require('../src/routes/team.routes');
const leagueRoutes = require('../src/routes/league.routes');
const journeyRoutes = require('../src/routes/journey.routes')

app.use(helmet()); //Seguridad de Express
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors()); //Aceptar solicitudes

//Configuración de rutas
app.use('/user', userRoutes);
app.use('/team', teamRoutes);
app.use('/league', leagueRoutes);
app.use('/journey', journeyRoutes);

module.exports = app;