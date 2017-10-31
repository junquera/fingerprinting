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

Fingerprint.sync({force: false});

function getFingerprint(fingerprint) {
    return Fingerprint.findOne({
      where: {
        fingerprint: fingerprint
      }
    });
}

function saveFingerprint(data) {
    return getFingerprint(data.fingerprint).then(function(obj){
        if(obj) { // update
          return obj.update(data);
        }
        else { // insert
          return Fingerprint.create(data);
        }
    });
}


module.exports = sequelize.authenticate().then(() =>{
    return {
        saveFingerprint: saveFingerprint,
        getFingerprint: getFingerprint
    };
});
