const db = require('./db');
const config = require('../config');
const fs = require('fs');
const bcryptjs = require('bcryptjs');


const User = {
    async init() {
        if (config.db.cleanOnStatup) {
            await db.execute('drop table if exists users');
        };

        await db.execute(`
        CREATE TABLE users (
            id int NOT NULL AUTO_INCREMENT,
            username varchar(255) NOT NULL,
            password varchar(255) NOT NULL,
            email varchar(255) NOT NULL,
            PRIMARY KEY (id),
            UNIQUE KEY id_UNIQUE (id)
          );
          `)
        
        if (config.db.loadMockupData) {
            const mockups = JSON.parse(fs.readFileSync('./models/mockups/users.json', 'utf8'));
            mockups.forEach(async (mockups) => {
                await User.createUser(mockups);
            });
        };
    },

    async createUser(user) {
        const name = user.user || user.id;
        let password = user.password || user._json.psuid;
        const salt = bcryptjs.genSaltSync(config.bcryptjs.saltRounds);
        password = bcryptjs.hashSync(password, salt);

        const newUser = await db.query('insert into users values(default, ?, ?, ?)', [name, password, user.email = 'empty']);
        return newUser;
    },

    async findUserByName(name) {
        const user = await db.query('SELECT * from users WHERE username = ?', [name]);
        return user;
    },


    checkPassword(user, password) {
        return bcryptjs.compareSync(password, user.password);
    }

}

module.exports = User;