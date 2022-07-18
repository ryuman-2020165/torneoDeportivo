'use strict'
const app = require('./configs/app');
const mongo = require('./configs/mongoConfig');
const port = 3200;

const { findUser, encrypt } = require('./src/utils/validate');
const User = require('./src/models/user.model');

mongo.init();
app.listen(port, async () => {
    console.log(`Conectado al puerto ${port}`)

    let data = {
        name: 'ADMIN',
        surname: 'ADMIN',
        username: 'ADMIN',
        email: 'ADMIN',
        password: await encrypt('deportes123'),
        role: 'ADMIN'
    };

    let checkUser = await findUser(data.username);
    if (!checkUser) {
        let user = new User(data);
        await user.save();
        console.log('Usuario ADMIN registrado')
    }
});