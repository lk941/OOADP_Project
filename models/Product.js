const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Product = db.define('product', {
    orgId: {
        type: Sequelize.STRING
    },
    name: {
        type: Sequelize.STRING
    },
    product_type: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING(3000)
    },
    publishDate: {
        type: Sequelize.DATE
    },
    cost: {
        type: Sequelize.STRING
    },
    origin: {
        type: Sequelize.STRING
    },
    deliveryfee: {
        type: Sequelize.STRING
    },
    images: {
        type: Sequelize.STRING
    },
    ratings: {
        type: Sequelize.INTEGER
    },
    comments: {
        type: Sequelize.STRING(3000)
    },
    
});

module.exports = Product;