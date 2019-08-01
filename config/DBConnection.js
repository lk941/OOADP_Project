const mySQLDB = require('./DBConfig');
const user = require('../models/User');
const order = require('../models/Order');
const product = require('../models/Product');


// If drop is true, all existing tables are dropped and recreated
const setUpDB = (drop) => {
    mySQLDB.authenticate()
    .then(() => {
        console.log('Database connected');
    })
    .then(() => {
       order.belongsTo(user);
       order.belongsTo(product);
       user.hasMany(order);
       user.hasMany(product);
       product.hasMany(order);
       product.belongsTo(user);

       mySQLDB.sync({ // Creates table if none exists
           force: drop
       }).then(() => {
           console.log('Create tables if none exists');
       }).catch(err => console.log(err))
    })
    .catch(err => console.log('Error:' + err));
};

module.exports = {setUpDB};
