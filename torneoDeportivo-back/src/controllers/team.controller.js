'use strict'
const { validateData, checkUpdateTeams } = require('../utils/validate');
const Team = require('../models/team.model');
const League = require('../models/league.model');
const Journey = require('../models/journey.model');

exports.testTeam = (req, res) => {
    return res.send({ message: 'Mensaje de prueba desde el controlador de equipos' });
};

exports.addTeam_OnlyAdmin = async (req, res) => {
    try {
        const params = req.body;
        let data = {
            league: params.league,
            name: params.name,
            country: params.country,
            proGoals: 0,
            againstGoals: 0,
            differenceGoals: 0,
            playedMatches: 0,
        };
        let msg = validateData(data);
        if (!msg) {
            const checkLeague = await League.findOne({ _id: data.league });
            if (checkLeague.teams.length > 9) {
                return res.status(400).send({ message: 'Ya no puedes agregar equipos a esta liga (Límite 10)' })
            } else {
                let team = new Team(data);
                await team.save();
                await League.findOneAndUpdate({ _id: data.league }, { $push: { teams: team._id } }, { new: true });
                if (checkLeague.teams.length > 0) {
                    const journey = new Journey({ name: `Jornada ${checkLeague.teams.length}` });
                    await journey.save();
                    await checkLeague.journeys.push(journey);
                    await checkLeague.save();
                }
                const updatedLeague = await League.findOne({ _id: data.league }).populate('teams')
                return res.send({ message: 'Equipo guardado exitosamente en la liga', updatedLeague });
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error al guardar el equipo' });
    }
}

exports.getTeam_OnlyAdmin = async (req, res) => {
    try {
        const teamId = req.params.id;
        const params = req.body;
        let data = {
            league: params.league,
        };

        let msg = validateData(data);
        if (!msg) {
            const checkUserLeague = await League.findOne({ _id: data.league, teams: teamId }).populate('teams').lean();

            if (checkUserLeague === null) {
                return res.status(400).send({ message: 'No puedes ver este equipo' })
            } else {
                const team = await Team.findOne({ _id: teamId });
                if (!team) {
                    return res.send({ message: 'Equipo no encontrado' });
                } else {
                    return res.send({ messsage: 'Equipo encontrado:', team });
                }
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo el equipo' });
    }
}

exports.getTeams_OnlyAdmin = async (req, res) => {
    try {
        const params = req.body;
        let data = {
            league: params.league,
        };

        let msg = validateData(data);
        if (!msg) {
            const checkUserLeague = await League.findOne({ _id: data.league }).populate('teams').lean();
            const teams = checkUserLeague.teams
            if (checkUserLeague === null) {
                return res.status(400).send({ message: 'No puedes ver los equipos' })
            } else {
                return res.send({ messsage: 'Equipos encontrados:', teams });
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo los equipos' });
    }
}

exports.updateTeam_OnlyAdmin = async (req, res) => {
    try {
        const teamId = req.params.id;
        const params = req.body;
        let data = {
            league: params.league,
        };
        let msg = validateData(data);
        if (!msg) {
            const checkLeague = await League.findOne({ _id: data.league, teams: teamId }).lean();

            if (checkLeague === null) {
                return res.status(400).send({ message: 'No puedes editar este equipo' })
            } else {
                const checkUpdated = await checkUpdateTeams(params);
                if (checkUpdated === false) {
                    return res.status(400).send({ message: 'Parámetros inválidos' })
                } else {
                    const updateTeam = await Team.findOneAndUpdate({ _id: teamId }, params, { new: true }).lean();
                    if (!updateTeam) {
                        return res.send({ message: 'No se ha podido actualizar el equipo' })
                    } else {
                        return res.send({ message: 'Equipo actualizado', updateTeam })
                    }
                }
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error actualizando el equipo' });
    }
}

exports.deleteTeam_OnlyAdmin = async (req, res) => {
    try {
        const teamId = req.params.id;
        const params = req.body;
        let data = {
            league: params.league,
        };

        let msg = validateData(data);
        if (!msg) {
            const checkLeague = await League.findOne({ _id: data.league, teams: teamId });

            if (checkLeague === null) {
                return res.status(400).send({ message: 'No puedes eliminar este equipo' })
            } else {
                const deleteTeam = await Team.findOneAndDelete({ _id: teamId });
                await checkLeague.teams.pull(deleteTeam);

                const deleteJourney = await Journey.findOneAndDelete({ _id: checkLeague.journeys.at(-1) });
                await checkLeague.journeys.pull(deleteJourney);
                await checkLeague.save();
                if (!deleteTeam) {
                    return res.status(500).send({ message: 'Equipo no encontrado o ya eliminado' });
                } else {
                    return res.send({ message: 'Equipo eliminado exitosamente', deleteTeam });
                }
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error al intentar eliminar el equipo' });
    }
}

exports.createChart_OnlyAdmin = async (req, res) => {
    try {
        const params = req.body;
        let data = {
            league: params.league,
        };

        let msg = validateData(data);
        if (!msg) {
            const checkUserLeague = await League.findOne({ _id: data.league }).populate('teams');

            const teams = checkUserLeague.teams.sort((a, b) => {
                return b.proGoals - a.proGoals
            })

            if (checkUserLeague === null) {
                return res.status(400).send({ message: 'No puedes ver los equipos' })
            } else {
                return res.send({ messsage: 'Equipos encontrados:', teams });
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo los equipos' });
    }
}

exports.addTeam = async (req, res) => {
    try {
        const params = req.body;
        const userId = req.user.sub;
        let data = {
            league: req.params.league,
            name: params.name,
            country: params.country,
            proGoals: 0,
            againstGoals: 0,
            differenceGoals: 0,
            playedMatches: 0,
        };
        let msg = validateData(data);
        if (!msg) {
            const checkUserLeague = await League.findOne({ _id: data.league });
            if (checkUserLeague === null || checkUserLeague.user != userId) {
                return res.status(400).send({ message: 'No puedes agregar un equipo a esta liga' })
            } else {
                if (checkUserLeague.teams.length > 9) {
                    return res.status(400).send({ message: 'Ya no puedes agregar equipos a esta liga (Límite 10)' })
                } else {
                    let team = new Team(data);
                    await team.save();
                    await League.findOneAndUpdate({ _id: data.league }, { $push: { teams: team._id } }, { new: true });
                    if (checkUserLeague.teams.length > 0) {
                        const journey = new Journey({ name: `Jornada ${checkUserLeague.teams.length}` });
                        await journey.save();
                        await checkUserLeague.journeys.push(journey);
                        await checkUserLeague.save();
                    }
                    const updatedLeague = await League.findOne({ _id: data.league }).populate('teams')
                    return res.send({ message: 'Equipo guardado exitosamente en la liga', updatedLeague });
                }
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error al guardar el equipo' });
    }
}

exports.getTeam = async (req, res) => {
    try {
        const teamId = req.params.id;
        const userId = req.user.sub;
        const params = req.body;
        let data = {
            league: req.params.league,
        };

        let msg = validateData(data);
        if (!msg) {
            const checkUserLeague = await League.findOne({ _id: data.league, teams: teamId }).populate('teams').lean();

            if (checkUserLeague === null || checkUserLeague.user != userId) {
                return res.status(400).send({ message: 'No puedes ver este equipo' })
            } else {
                const team = await Team.findOne({ _id: teamId });
                if (!team) {
                    return res.send({ message: 'Equipo no encontrado' });
                } else {
                    return res.send({ messsage: 'Equipo encontrado:', team });
                }
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo el equipo' });
    }
}

exports.getTeams = async (req, res) => {
    try {
        const userId = req.user.sub;
        const params = req.body;
        let data = {
            league: req.params.league,
        };

        let msg = validateData(data);
        if (!msg) {
            const checkUserLeague = await League.findOne({ _id: data.league }).populate('teams').lean();
            const teams = checkUserLeague.teams
            if (checkUserLeague === null || checkUserLeague.user != userId) {
                return res.status(400).send({ message: 'No puedes ver los equipos' })
            } else {
                return res.send({ messsage: 'Equipos encontrados:', teams });
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo los equipos' });
    }
}

exports.updateTeam = async (req, res) => {
    try {
        const teamId = req.params.id;
        const userId = req.user.sub;
        const params = req.body;
        let data = {
            league: req.params.league,
        };
        let msg = validateData(data);
        if (!msg) {
            const checkUserLeague = await League.findOne({ _id: data.league, teams: teamId }).lean();

            if (checkUserLeague === null || checkUserLeague.user != userId) {
                return res.status(400).send({ message: 'No puedes editar este equipo' })
            } else {
                const checkUpdated = await checkUpdateTeams(params);
                if (checkUpdated === false) {
                    return res.status(400).send({ message: 'Parámetros inválidos' })
                } else {
                    const updateTeam = await Team.findOneAndUpdate({ _id: teamId }, params, { new: true }).lean();
                    if (!updateTeam) {
                        return res.send({ message: 'No se ha podido actualizar el equipo' })
                    } else {
                        return res.send({ message: 'Equipo actualizado', updateTeam })
                    }
                }
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error actualizando el equipo' });
    }
}

exports.deleteTeam = async (req, res) => {
    try {
        const teamId = req.params.id;
        const userId = req.user.sub;
        const params = req.body;
        let data = {
            league: req.params.league,
        };

        let msg = validateData(data);
        if (!msg) {
            const checkUserLeague = await League.findOne({ _id: data.league, teams: teamId });
            if (checkUserLeague === null || checkUserLeague.user != userId) {
                return res.status(400).send({ message: 'No puedes eliminar este equipo' })
            } else {
                const deleteTeam = await Team.findOneAndDelete({ _id: teamId });
                await checkUserLeague.teams.pull(deleteTeam);

                const deleteJourney = await Journey.findOneAndDelete({ _id: checkUserLeague.journeys.at(-1) });
                await checkUserLeague.journeys.pull(deleteJourney);
                await checkUserLeague.save();
                if (!deleteTeam) {
                    return res.status(500).send({ message: 'Equipo no encontrado o ya eliminado' });
                } else {
                    return res.send({ message: 'Equipo eliminado exitosamente', deleteTeam });
                }
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error al intentar eliminar el equipo' });
    }
}

exports.createChart = async (req, res) => {
    try {
        const userId = req.user.sub;
        const params = req.body;
        let data = {
            league: req.params.league,
        };

        let msg = validateData(data);
        if (!msg) {
            const checkUserLeague = await League.findOne({ _id: data.league }).populate('teams').lean();
            
            const teams = checkUserLeague.teams.sort((a, b) => {
                return b.proGoals - a.proGoals
            })

            if (checkUserLeague === null || checkUserLeague.user != userId) {
                return res.status(400).send({ message: 'No puedes ver los equipos' })
            } else {
                return res.send({ messsage: 'Equipos encontrados:', teams });
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo los equipos' });
    }
}