const Sequelize = require('sequelize');
const sequelize = new Sequelize('fingerprint', 'user', 'pass', {
    host: 'localhost',
    dialect: 'sqlite',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    storage: 'database.sqlite'
});

const Fingerprint = sequelize.define('fingerprint', {
    username: {
        type: Sequelize.STRING
    },
    fingerprint: {
        type: Sequelize.STRING
    }
});

sequelize.authenticate().then(() =>{
    module.exports = {
        saveFingerprint: function(fingerprint, username) {
            return Fingerprint.create({
                fingerprint: fingerprint,
                username: username
            });
        },
        getFingerprint: function(fingerprint) {
            return Fingerprint.findOne({
                fingerprint: fingerprint
            });
        }
    };
})
