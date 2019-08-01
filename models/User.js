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
    country: {
        type: Sequelize.STRING
    },
    unitNo: {
        type: Sequelize.STRING
    },
    postalCode: {
        type: Sequelize.STRING
    },
    order_history: {
        type: Sequelize.STRING
    },
    org_id: {
        type: Sequelize.STRING
    },
    org_name: {
        type: Sequelize.STRING
    },
    org_ic: {
        type: Sequelize.STRING
    },
    org_type: {
        type: Sequelize.STRING
    },
    org_size: {
        type: Sequelize.STRING
    },
    org_rating: {
        type: Sequelize.STRING
    },
    org_location: {
        type: Sequelize.STRING
    },
    org_phone: {
        type: Sequelize.STRING
    },
    org_website: {
        type: Sequelize.STRING
    },
    org_address: {
        type: Sequelize.STRING
    },
    org_country: {
        type: Sequelize.STRING
    },
    org_unitNo: {
        type: Sequelize.STRING
    },
    org_postalCode: {
        type: Sequelize.STRING
    },
    is_org: {
        type: Sequelize.BOOLEAN
    },
    org_products: {
        type: Sequelize.STRING
    },
    wallet: {
        type: Sequelize.INTEGER
    },
    verified: {
        type: Sequelize.BOOLEAN
    },
});

module.exports = User;
