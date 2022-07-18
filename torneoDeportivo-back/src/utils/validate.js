'use strict'

const User = require('../models/user.model');
const bcrypt = require('bcrypt-nodejs');
const League = require('../models/league.model');
const Team = require('../models/team.model');

exports.validateData = (data) => {
    let keys = Object.keys(data),
        msg = '';

    for (let key of keys) {
        if (data[key] !== null && data[key] !== undefined && data[key] !== '') continue;
        msg += `El parámetro ${key} es obligatorio\n`
    }
    return msg.trim();
}

//* Usuarios ---------------------------------------------------------------------------------------

exports.findUser = async (username) => {
    try {
        let exist = await User.findOne({ username: username }).lean();
        return exist;
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.checkPassword = async (password, hash) => {
    try {
        return bcrypt.compareSync(password, hash);
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.encrypt = async (password) => {
    try {
        return bcrypt.hashSync(password);
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.checkUpdate = async (params) => {
    try {
        if (params.password || Object.entries(params).length === 0 || params.role) {
            return false;
        } else {
            return true;
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.checkUpdate_OnlyAdmin = async (params) => {
    try {
        if (Object.entries(params).length === 0 || params.password) {
            return false;
        } else {
            return true;
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.alreadyUser = async (username) => {
    try {
        let exist = User.findOne({ username: username }).lean()
        return exist;
    } catch (err) {
        return err;
    }
}

//* Equipos ---------------------------------------------------------------------------------------

exports.checkUpdateTeams = async (params) => {
    try {
        if (Object.entries(params).length === 0 || params.proGoals || params.againstGoals || params.differenceGoals || params.playedMatches) {
            return false;
        } else {
            return true;
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

//* Ligas ------------------------------------------------------------------------------------

exports.findLeague = async (name) => {
    try {
        let exist = await League.findOne({ name: name });
        return exist;
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.checkUpdateLeague = async (params) => {
    try {
        if (Object.entries(params).length === 0 || params.teams || params.journeys || params.user) {
            return false;
        } else {
            return true;
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

//* Jornadas ---------------------------------------------------------------------------------------

exports.teamExist = async (team) => {
    try {
        const teamFound = await Team.findOne({ _id: team });
        if (!teamFound) {
            return false;
        } else {
            return true;
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.checkUpdateJourney = async (params) => {
    try {
        if (Object.entries(params).length === 0 || params.match) {
            return false;
        } else {
            return true;
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.checkUpdateMatch = async (params) => {
    try {
        if (Object.entries(params).length === 0) {
            return false;
        } else {
            return true;
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}