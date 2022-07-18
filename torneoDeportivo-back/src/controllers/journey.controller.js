'use strict'
const { validateData, checkUpdateJourney, teamExist, checkUpdateMatch } = require('../utils/validate');
const League = require('../models/league.model')
const Journey = require('../models/journey.model');
const Team = require('../models/team.model');

exports.testJourney = (req, res) => {
    return res.send({ message: 'Mensaje de prueba desde el controlador de jornadas' });
}

exports.getJourney_OnlyAdmin = async (req, res) => {
    try {
        const journeyId = req.params.id;
        const params = req.body;
        let data = {
            league: params.league,
        };

        let msg = validateData(data);
        if (!msg) {
            const checkUserLeague = await League.findOne({ _id: data.league, journeys: journeyId }).populate('journeys').lean();

            if (checkUserLeague === null) {
                return res.status(400).send({ message: 'No puedes ver esta jornada' })
            } else {
                const journey = await Journey.findOne({ _id: journeyId }).populate("match.team1 match.team2");
                if (!journey) {
                    return res.send({ message: 'La jornada ingresada no ha podido encontrar' });
                } else {
                    return res.send({ messsage: 'Jornada encontrada: ', journey });
                }
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo la jornada' })
    }
}

exports.getJourneys_OnlyAdmin = async (req, res) => {
    try {
        const params = req.body;
        let data = {
            league: params.league,
        };

        let msg = validateData(data);
        if (!msg) {
            const checkUserLeague = await League.findOne({ _id: data.league }).populate('journeys').lean();
            const journeys = checkUserLeague.journeys
            if (checkUserLeague === null) {
                return res.status(400).send({ message: 'No puedes ver las jornadas' })
            } else {
                return res.send({ messsage: 'Jornadas encontradas: ', journeys });
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error encontrando las jornadas' });
    }
}

exports.updateJourney_OnlyAdmin = async (req, res) => {
    try {
        const journeyId = req.params.id;
        const params = req.body;
        let data = {
            league: params.league,
        };
        let msg = validateData(data);
        if (!msg) {
            const checkUserLeague = await League.findOne({ _id: data.league, journeys: journeyId }).lean();

            if (checkUserLeague === null) {
                return res.status(400).send({ message: 'No puedes editar esta jornada' })
            } else {
                const checkUpdated = await checkUpdateJourney(params);
                if (checkUpdated === false) {
                    return res.status(400).send({ message: 'Parámetros inválidos' })
                } else {
                    const updateJourney = await Journey.findOneAndUpdate({ _id: journeyId }, params, { new: true }).lean();
                    if (!updateJourney) {
                        return res.send({ message: 'No se ha podido actualizar la jornada' })
                    } else {
                        return res.send({ message: 'Jornada actualizada', updateJourney })
                    }
                }
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error actualizando la jornada' });
    }
}

exports.addMatch_OnlyAdmin = async (req, res) => {
    try {
        const journeyId = req.params.id;
        const params = req.body;
        let data = {
            league: params.league,
            team1: params.team1,
            score1: params.score1,
            team2: params.team2,
            score2: params.score2,
        };
        let msg = validateData(data);

        if (!msg) {
            const checkUserLeague = await League.findOne({ _id: data.league, journeys: journeyId });
            if (checkUserLeague === null) {
                return res.status(400).send({ message: 'No puedes agregar partidos a esta jornada' })
            } else {
                const checkMatchesJourney = await Journey.findOne({ _id: journeyId }).populate('match').lean();
                if (checkMatchesJourney.match.length > checkUserLeague.journeys.length) {
                    return res.status(400).send({ message: 'Ya no puedes agregar mas partidos a esta jornada' })
                } else {
                    const checkTeam1League = await League.findOne({ _id: data.league, teams: data.team1 }).populate('teams').lean();
                    if (checkTeam1League === null) {
                        return res.status(400).send({ message: 'El primer equipo seleccionado no se encuentra en la liga' })
                    } else {
                        const checkTeam2League = await League.findOne({ _id: data.league, teams: data.team2 }).populate('teams').lean();
                        if (checkTeam2League === null) {
                            return res.status(400).send({ message: 'El segundo equipo seleccionado no se encuentra en la liga' })
                        } else {
                            if (data.team1 !== data.team2) {
                                if (await teamExist(data.team1) === true && await teamExist(data.team2) === true) {
                                    let journey = await Journey.findOne({ _id: journeyId });

                                    await journey.match.push(data);

                                    const team1 = await Team.findOne({ _id: data.team1 });
                                    const team1Data = {
                                        proGoals: team1.proGoals + Number.parseInt(data.score1),
                                        againstGoals: team1.againstGoals + Number.parseInt(data.score2),
                                        differenceGoals: team1.differenceGoals + Number.parseInt(data.score1) - Number.parseInt(data.score2),
                                        playedMatches: team1.playedMatches + 1
                                    }
                                    await Team.findOneAndUpdate({ _id: team1._id }, team1Data, { new: true }).lean();

                                    const team2 = await Team.findOne({ _id: data.team2 });
                                    const team2Data = {
                                        proGoals: team2.proGoals + Number.parseInt(data.score2),
                                        againstGoals: team2.againstGoals + Number.parseInt(data.score1),
                                        differenceGoals: team2.differenceGoals + Number.parseInt(data.score2) - Number.parseInt(data.score1),
                                        playedMatches: team2.playedMatches + 1
                                    }
                                    await Team.findOneAndUpdate({ _id: team2._id }, team2Data, { new: true }).lean();

                                    await journey.save();

                                    return res.send({ message: 'Partido guardado exitosamente', data });
                                } else {
                                    return res.status(400).send({ message: "No se ha encontrado alguno de los dos equipos" });
                                }
                            } else {
                                return res.status(400).send({ message: "No se puede enfrentar un equipo con sí mismo" });
                            }
                        }
                    }
                }
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error al guardar el partido' });
    }
}

exports.getMatch_OnlyAdmin = async (req, res) => {
    try {
        const matchId = req.params.id;
        const params = req.body;
        let data = {
            league: params.league,
            journey: params.journey
        };

        let msg = validateData(data);
        if (!msg) {
            const checkUserLeague = await League.findOne({ _id: data.league, journeys: data.journey }).populate('journeys').lean();

            if (checkUserLeague === null) {
                return res.status(400).send({ message: 'No puedes ver este partido' })
            } else {
                const journey = await Journey.findOne({ _id: data.journey }).populate('match.team1 match.team2');
                const match = await journey.match.id(matchId);
                if (!match) {
                    return res.send({ message: 'Partido no encontrado' });
                } else {
                    return res.send({ messsage: 'Partido encontrado:', match });
                }
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error al obtener el partido' });
    }
}

exports.getMatches_OnlyAdmin = async (req, res) => {
    try {
        const params = req.body;
        let data = {
            league: params.league,
            journey: params.journey
        };

        let msg = validateData(data);
        if (!msg) {
            const checkUserLeague = await League.findOne({ _id: data.league, journeys: data.journey }).populate('journeys').lean();

            if (checkUserLeague === null) {
                return res.status(400).send({ message: 'No puedes ver los equipos' })
            } else {
                const journey = await Journey.findOne({ _id: data.journey }).populate('match.team1 match.team2');
                const matches = journey.match;

                if (!matches) {
                    return res.send({ message: 'Partidos no encontrados' });
                } else {
                    return res.send({ messsage: 'Partidos encontrados:', matches });
                }
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.updateMatch_OnlyAdmin = async (req, res) => {
    try {
        const matchId = req.params.id
        const params = req.body;
        let data = {
            league: params.league,
            journey: params.journey
        };
        let msg = validateData(data);

        if (!msg) {
            const checkUserLeague = await League.findOne({ _id: data.league, journeys: data.journey });
            if (checkUserLeague === null) {
                return res.status(400).send({ message: 'No puedes editar partidos a esta jornada' })
            } else {
                if (await checkUpdateMatch(params) == true) {
                    const journey = await Journey.findOne({ _id: data.journey });
                    const match = await journey.match.id(matchId);
                    if (match) {
                        if (await teamExist(match.team1) && await teamExist(match.team2) === true) {
                            const team1 = await Team.findOne({ _id: match.team1 });
                            const team1Data = {
                                proGoals: team1.proGoals - match.score1 + Number.parseInt(params.score1),
                                againstGoals: team1.againstGoals - match.score2 + Number.parseInt(params.score2),
                                differenceGoals: team1.differenceGoals - match.score1 + match.score2 + Number.parseInt(params.score1) - Number.parseInt(params.score2)
                            }
                            await Team.findOneAndUpdate({ _id: team1._id }, team1Data, { new: true }).lean();

                            const team2 = await Team.findOne({ _id: match.team2 });
                            const team2Data = {
                                proGoals: team2.proGoals - match.score2 + Number.parseInt(params.score2),
                                againstGoals: team2.againstGoals - match.score1 + Number.parseInt(params.score1),
                                differenceGoals: team2.differenceGoals - match.score2 + match.score1 + Number.parseInt(params.score2) - Number.parseInt(params.score1),
                            }
                            await Team.findOneAndUpdate({ _id: team2._id }, team2Data, { new: true }).lean();

                            await match.set(params);
                            await journey.save();
                            return res.send({ message: 'Partido actualizado exitosamente', params });
                        } else {
                            return res.status(400).send({ message: "No se ha encontrado alguno de los dos equipos" });
                        }
                    } else {
                        return res.status(400).send({ message: 'No se ha encontrado el partido' });
                    }
                } else {
                    return res.status(400).send({ message: "Parámetros inválidos" });
                }
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error al actualizar el partido' });
    }
}

exports.deleteMatch_OnlyAdmin = async (req, res) => {
    try {
        const matchId = req.params.id
        const params = req.body;
        let data = {
            league: params.league,
            journey: params.journey
        };
        let msg = validateData(data);

        if (!msg) {
            const checkUserLeague = await League.findOne({ _id: data.league, journeys: data.journey });
            if (checkUserLeague === null) {
                return res.status(400).send({ message: 'No puedes eliminar partidos a esta jornada' })
            } else {
                const journey = await Journey.findOne({ _id: data.journey });
                const match = await journey.match.id(matchId);
                if (match) {
                    if (await teamExist(match.team1) === true) {
                        const team1 = await Team.findOne({ _id: match.team1 });
                        const team1Data = {
                            proGoals: team1.proGoals - match.score1,
                            againstGoals: team1.againstGoals - match.score2,
                            differenceGoals: team1.differenceGoals - match.score1 + match.score2,
                            playedMatches: team1.playedMatches - 1
                        }
                        await Team.findOneAndUpdate({ _id: team1._id }, team1Data, { new: true }).lean();
                    }
                    if (await teamExist(match.team2) === true) {
                        const team2 = await Team.findOne({ _id: match.team2 });
                        const team2Data = {
                            proGoals: team2.proGoals - match.score2,
                            againstGoals: team2.againstGoals - match.score1,
                            differenceGoals: team2.differenceGoals - match.score2 + match.score1,
                            playedMatches: team2.playedMatches - 1
                        }
                        await Team.findOneAndUpdate({ _id: team2._id }, team2Data, { new: true }).lean();
                    }

                    await journey.match.pull(match);
                    await journey.save();
                    return res.send({ message: 'Partido borrado exitosamente', match });
                } else {
                    return res.send({ message: 'No se ha encontrado el partido' });
                }
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error al borrar el partido' });
    }
}

exports.getJourney = async (req, res) => {
    try {
        const journeyId = req.params.id;
        const userId = req.user.sub;
        const params = req.body;
        let data = {
            league: req.params.league,
        };

        let msg = validateData(data);
        if (!msg) {
            const checkUserLeague = await League.findOne({ _id: data.league, journeys: journeyId }).populate('journeys').lean();

            if (checkUserLeague === null || checkUserLeague.user != userId) {
                return res.status(400).send({ message: 'No puedes ver esta jornada' })
            } else {
                const journey = await Journey.findOne({ _id: journeyId }).populate("match.team1 match.team2");
                if (!journey) {
                    return res.send({ message: 'La jornada ingresada no ha podido encontrar' });
                } else {
                    return res.send({ messsage: 'Jornada encontrada: ', journey });
                }
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo la jornada' })
    }
}

exports.getJourneys = async (req, res) => {
    try {
        const userId = req.user.sub;
        const params = req.body;
        let data = {
            league: req.params.league,
        };

        let msg = validateData(data);
        if (!msg) {
            const checkUserLeague = await League.findOne({ _id: data.league }).populate('journeys').lean();
            const journeys = checkUserLeague.journeys
            if (checkUserLeague === null || checkUserLeague.user != userId) {
                return res.status(400).send({ message: 'No puedes ver las jornadas' })
            } else {
                return res.send({ messsage: 'Jornadas encontradas: ', journeys });
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error encontrando las jornadas' });
    }
}

exports.updateJourney = async (req, res) => {
    try {
        const journeyId = req.params.id;
        const userId = req.user.sub;
        const params = req.body;
        let data = {
            league: req.params.league,
        };
        let msg = validateData(data);
        if (!msg) {
            const checkUserLeague = await League.findOne({ _id: data.league, journeys: journeyId }).lean();

            if (checkUserLeague === null || checkUserLeague.user != userId) {
                return res.status(400).send({ message: 'No puedes editar esta jornada' })
            } else {
                const checkUpdated = await checkUpdateJourney(params);
                if (checkUpdated === false) {
                    return res.status(400).send({ message: 'Parámetros inválidos' })
                } else {
                    const updateJourney = await Journey.findOneAndUpdate({ _id: journeyId }, params, { new: true }).lean();
                    if (!updateJourney) {
                        return res.send({ message: 'No se ha podido actualizar la jornada' })
                    } else {
                        return res.send({ message: 'Jornada actualizada', updateJourney })
                    }
                }
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error actualizando la jornada' });
    }
}

exports.addMatch = async (req, res) => {
    try {
        const userId = req.user.sub;
        const journeyId = req.params.id;
        const params = req.body;
        let data = {
            league: req.params.league,
            team1: params.team1,
            score1: params.score1,
            team2: params.team2,
            score2: params.score2,
        };
        let msg = validateData(data);

        if (!msg) {
            const checkUserLeague = await League.findOne({ _id: data.league, journeys: journeyId });
            if (checkUserLeague === null || checkUserLeague.user != userId) {
                return res.status(400).send({ message: 'No puedes agregar partidos a esta jornada' })
            } else {
                const checkMatchesJourney = await Journey.findOne({ _id: journeyId }).populate('match').lean();
                if (checkMatchesJourney.match.length > checkUserLeague.journeys.length) {
                    return res.status(400).send({ message: 'Ya no puedes agregar mas partidos a esta jornada' })
                } else {
                    const checkTeam1League = await League.findOne({ _id: data.league, teams: data.team1 }).populate('teams').lean();
                    if (checkTeam1League === null) {
                        return res.status(400).send({ message: 'El primer equipo seleccionado no se encuentra en la liga' })
                    } else {
                        const checkTeam2League = await League.findOne({ _id: data.league, teams: data.team2 }).populate('teams').lean();
                        if (checkTeam2League === null) {
                            return res.status(400).send({ message: 'El segundo equipo seleccionado no se encuentra en la liga' })
                        } else {
                            if (data.team1 !== data.team2) {
                                if (await teamExist(data.team1) === true && await teamExist(data.team2) === true) {
                                    let journey = await Journey.findOne({ _id: journeyId });

                                    await journey.match.push(data);

                                    const team1 = await Team.findOne({ _id: data.team1 });
                                    const team1Data = {
                                        proGoals: team1.proGoals + Number.parseInt(data.score1),
                                        againstGoals: team1.againstGoals + Number.parseInt(data.score2),
                                        differenceGoals: team1.differenceGoals + Number.parseInt(data.score1) - Number.parseInt(data.score2),
                                        playedMatches: team1.playedMatches + 1
                                    }
                                    await Team.findOneAndUpdate({ _id: team1._id }, team1Data, { new: true }).lean();

                                    const team2 = await Team.findOne({ _id: data.team2 });
                                    const team2Data = {
                                        proGoals: team2.proGoals + Number.parseInt(data.score2),
                                        againstGoals: team2.againstGoals + Number.parseInt(data.score1),
                                        differenceGoals: team2.differenceGoals + Number.parseInt(data.score2) - Number.parseInt(data.score1),
                                        playedMatches: team2.playedMatches + 1
                                    }
                                    await Team.findOneAndUpdate({ _id: team2._id }, team2Data, { new: true }).lean();

                                    await journey.save();

                                    return res.send({ message: 'Partido guardado exitosamente', data });
                                } else {
                                    return res.status(400).send({ message: "No se ha encontrado alguno de los dos equipos" });
                                }
                            } else {
                                return res.status(400).send({ message: "No se puede enfrentar un equipo con sí mismo" });
                            }
                        }
                    }
                }
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error al guardar el partido' });
    }
}

exports.getMatch = async (req, res) => {
    try {
        const matchId = req.params.id;
        const userId = req.user.sub;
        const params = req.body;
        let data = {
            league: req.params.league,
            journey: req.params.journey
        };

        let msg = validateData(data);
        if (!msg) {
            const checkUserLeague = await League.findOne({ _id: data.league, journeys: data.journey }).populate('journeys').lean();

            if (checkUserLeague === null || checkUserLeague.user != userId) {
                return res.status(400).send({ message: 'No puedes ver este partido' })
            } else {
                const journey = await Journey.findOne({ _id: data.journey }).populate('match.team1 match.team2');
                const match = await journey.match.id(matchId);
                if (!match) {
                    return res.send({ message: 'Partido no encontrado' });
                } else {
                    return res.send({ messsage: 'Partido encontrado:', match });
                }
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error al obtener el partido' });
    }
}

exports.getMatches = async (req, res) => {
    try {
        const userId = req.user.sub;
        const params = req.body;
        let data = {
            league: req.params.league,
            journey: req.params.journey
        };

        let msg = validateData(data);
        if (!msg) {
            const checkUserLeague = await League.findOne({ _id: data.league, journeys: data.journey }).populate('journeys').lean();

            if (checkUserLeague === null || checkUserLeague.user != userId) {
                return res.status(400).send({ message: 'No puedes agregar partidos' })
            } else {
                const journey = await Journey.findOne({ _id: data.journey }).populate('match.team1 match.team2');
                const matches = journey.match;

                if (!matches) {
                    return res.send({ message: 'Partidos no encontrados' });
                } else {
                    return res.send({ messsage: 'Partidos encontrados:', matches });
                }
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.updateMatch = async (req, res) => {
    try {
        const userId = req.user.sub;
        const matchId = req.params.id
        const params = req.body;
        let data = {
            league: req.params.league,
            journey: req.params.journey
        };
        let msg = validateData(data);

        if (!msg) {
            const checkUserLeague = await League.findOne({ _id: data.league, journeys: data.journey });
            if (checkUserLeague === null || checkUserLeague.user != userId) {
                return res.status(400).send({ message: 'No puedes editar partidos a esta jornada' })
            } else {
                if (await checkUpdateMatch(params) == true) {
                    const journey = await Journey.findOne({ _id: data.journey });
                    const match = await journey.match.id(matchId);
                    if (match) {
                        if (await teamExist(match.team1) && await teamExist(match.team2) === true) {
                            const team1 = await Team.findOne({ _id: match.team1 });
                            const team1Data = {
                                proGoals: team1.proGoals - match.score1 + Number.parseInt(params.score1),
                                againstGoals: team1.againstGoals - match.score2 + Number.parseInt(params.score2),
                                differenceGoals: team1.differenceGoals - match.score1 + match.score2 + Number.parseInt(params.score1) - Number.parseInt(params.score2)
                            }
                            await Team.findOneAndUpdate({ _id: team1._id }, team1Data, { new: true }).lean();

                            const team2 = await Team.findOne({ _id: match.team2 });
                            const team2Data = {
                                proGoals: team2.proGoals - match.score2 + Number.parseInt(params.score2),
                                againstGoals: team2.againstGoals - match.score1 + Number.parseInt(params.score1),
                                differenceGoals: team2.differenceGoals - match.score2 + match.score1 + Number.parseInt(params.score2) - Number.parseInt(params.score1),
                            }
                            await Team.findOneAndUpdate({ _id: team2._id }, team2Data, { new: true }).lean();

                            await match.set(params);
                            await journey.save();
                            return res.send({ message: 'Partido actualizado exitosamente', params });
                        } else {
                            return res.status(400).send({ message: "No se ha encontrado alguno de los dos equipos" });
                        }
                    } else {
                        return res.status(400).send({ message: 'No se ha encontrado el partido' });
                    }
                } else {
                    return res.status(400).send({ message: "Parámetros inválidos" });
                }
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error al actualizar el partido' });
    }
}

exports.deleteMatch = async (req, res) => {
    try {
        const userId = req.user.sub;
        const matchId = req.params.id
        const params = req.body;
        let data = {
            league: req.params.league,
            journey: req.params.journey
        };
        let msg = validateData(data);

        if (!msg) {
            const checkUserLeague = await League.findOne({ _id: data.league, journeys: data.journey });
            if (checkUserLeague === null || checkUserLeague.user != userId) {
                return res.status(400).send({ message: 'No puedes eliminar partidos a esta jornada' })
            } else {
                const journey = await Journey.findOne({ _id: data.journey });
                const match = await journey.match.id(matchId);
                if (match) {
                    if (await teamExist(match.team1) === true) {
                        const team1 = await Team.findOne({ _id: match.team1 });
                        const team1Data = {
                            proGoals: team1.proGoals - match.score1,
                            againstGoals: team1.againstGoals - match.score2,
                            differenceGoals: team1.differenceGoals - match.score1 + match.score2,
                            playedMatches: team1.playedMatches - 1
                        }
                        await Team.findOneAndUpdate({ _id: team1._id }, team1Data, { new: true }).lean();
                    }
                    if (await teamExist(match.team2) === true) {
                        const team2 = await Team.findOne({ _id: match.team2 });
                        const team2Data = {
                            proGoals: team2.proGoals - match.score2,
                            againstGoals: team2.againstGoals - match.score1,
                            differenceGoals: team2.differenceGoals - match.score2 + match.score1,
                            playedMatches: team2.playedMatches - 1
                        }
                        await Team.findOneAndUpdate({ _id: team2._id }, team2Data, { new: true }).lean();
                    }

                    await journey.match.pull(match);
                    await journey.save();
                    return res.send({ message: 'Partido borrado exitosamente', match });
                } else {
                    return res.send({ message: 'No se ha encontrado el partido' });
                }
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error al borrar el partido' });
    }
}