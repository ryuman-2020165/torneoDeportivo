'use strict'

const League = require('../models/league.model');
const { validateData, checkUpdateLeague, findLeague } = require('../utils/validate');

exports.testLeague = (req, res) => {
    return res.send({ message: 'Mensaje de prueba desde el controlador de ligas' });
}

exports.addLeague_OnlyAdmin = async (req, res) => {
    try {
        const params = req.body;
        const data = {
            user: params.user,
            name: params.name,
            country: params.country
        }
        const msg = validateData(data);
        if (!msg) {
            const league = new League(data);
            await league.save();
            return res.send({ message: 'Liga creada satisfatoriamente', league });
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error al guardar la liga' });
    }
}

exports.getLeague_OnlyAdmin = async (req, res) => {
    try {
        const leagueId = req.params.id;

        const league = await League.findOne({ _id: leagueId });
        if (!league) {
            return res.send({ message: 'Liga no encontrada' });
        } else {
            return res.send({ messsage: 'Liga encontrada:', league });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo la liga' });
    }
}

exports.getLeagues_OnlyAdmin = async (req, res) => {
    try {
        const leagues = await League.find().lean();
        if (!leagues) {
            return res.send({ message: 'Ligas no encontradas' });
        } else {
            return res.send({ messsage: 'Ligas encontradas:', leagues });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo las ligas' });
    }
}

exports.updateLeague_OnlyAdmin = async (req, res) => {
    try {
        const leagueId = req.params.id;
        const params = req.body;

        const checkUpdated = await checkUpdateLeague(params);
        if (!checkUpdated) {
            return res.status(400).send({ message: 'Parámetros inválidos' })
        } else {
            const updateLeague = await League.findOneAndUpdate({ _id: leagueId }, params, { new: true }).lean();
            if (!updateLeague) {
                return res.send({ message: 'No se ha podido actualizar la liga' })
            } else {
                return res.send({ message: 'Liga actualizada', updateLeague })
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error actualizando la liga' });
    }
}

exports.deleteLeague_OnlyAdmin = async (req, res) => {
    try {
        const leagueId = req.params.id;

        const deleteLeague = await League.findOneAndDelete({ _id: leagueId });
        if (!deleteLeague) {
            return res.status(500).send({ message: 'Liga no encontrada o ya eliminado' });
        } else {
            return res.send({ message: 'Liga eliminada exitosamente', deleteLeague });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error al intentar eliminar la liga' });
    }
}

exports.addLeague = async (req, res) => {
    try {
        const params = req.body;
        const data = {
            user: req.user.sub,
            name: params.name,
            country: params.country
        }
        const msg = validateData(data);
        if (!msg) {
            const league = new League(data);
            await league.save();
            return res.send({ message: 'Liga creada satisfatoriamente', league });
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error al guardar la liga' });
    }
}

exports.getLeague = async (req, res) => {
    try {
        const leagueId = req.params.id;
        const userId = req.user.sub

        const checkUserLeague = await League.findOne({ _id: leagueId }).populate('teams').lean()
        if (checkUserLeague.user != userId) {
            return res.status(400).send({ message: 'No puedes ver esta liga' })
        } else {
            const league = await League.findOne({ _id: leagueId });
            if (!league) {
                return res.send({ message: 'Liga no encontrada' });
            } else {
                return res.send({ messsage: 'Liga encontrada:', league });
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo la liga' });
    }
}

exports.getLeagues = async (req, res) => {
    try {
        const userId = req.user.sub
        const leagues = await League.find({ user: userId })

        if (!leagues) {
            return res.send({ message: 'Ligas no encontradas' });
        } else {
            return res.send({ messsage: 'Ligas encontradas:', leagues });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo las ligas' });
    }
}

exports.updateLeague = async (req, res) => {
    try {
        const leagueId = req.params.id;
        const params = req.body;
        const userId = req.user.sub

        const checkUserLeague = await League.findOne({ _id: leagueId })
        if (checkUserLeague.user != userId) {
            return res.status(400).send({ message: 'No puedes actualizar esta liga' })
        } else {
            const checkUpdated = await checkUpdateLeague(params);
            if (!checkUpdated) {
                return res.status(400).send({ message: 'Parámetros inválidos' })
            } else {
                const updateLeague = await League.findOneAndUpdate({ _id: leagueId }, params, { new: true }).lean();
                if (!updateLeague) {
                    return res.send({ message: 'No se ha podido actualizar la liga' })
                } else {
                    return res.send({ message: 'Liga actualizada', updateLeague })
                }
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error actualizando la liga' });
    }
}

exports.deleteLeague = async (req, res) => {
    try {
        const userId = req.user.sub
        const leagueId = req.params.id;
        const checkUserLeague = await League.findOne({ _id: leagueId })

        if (checkUserLeague.user != userId || checkUserLeague === null) {
            return res.status(400).send({ message: 'No puedes eliminar esta liga o ya ha sido eliminada' })
        } else {
            const deleteLeague = await League.findOneAndDelete({ _id: leagueId });
            if (!deleteLeague) {
                return res.status(500).send({ message: 'Liga no encontrada o ya se ha eliminado' });
            } else {
                return res.send({ message: 'Liga eliminada exitosamente', deleteLeague });
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error al intentar eliminar la liga' });
    }
}