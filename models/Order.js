const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Order = db.define('order', {
    user_id: {
        type: Sequelize.STRING
    },
    boughtDate: {
        type: Sequelize.DATE
    },
    cost: {
        type: Sequelize.STRING
    },
    destination: {
        type: Sequelize.STRING
    },
    product_id: {
        type: Sequelize.STRING
    }
});

module.exports = Order;