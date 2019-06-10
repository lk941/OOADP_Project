const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

/* Creates a user(s) table in MySQL Database.
   Note that Sequelize automatically pleuralizes the entity name as the table name
*/

const User = db.define('user', {
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    user_type: {
        type: Sequelize.STRING
    },
    status: {
        type: Sequelize.STRING
    },
    photoURL: {
        type: Sequelize.STRING
    },
    gender: {
        type: Sequelize.STRING
    },
    phoneNo: {
        type: Sequelize.STRING
    },
    dob: {
        type: Sequelize.STRING
    },
    address: {
        type: Sequelize.STRING
    },
    order_history: {
        type: Sequelize.STRING
    },
});

module.exports = User;
