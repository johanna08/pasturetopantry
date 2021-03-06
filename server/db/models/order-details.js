'use strict';
var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('orderDetails', {
    name: {
        type: Sequelize.STRING,
        // allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        // validate: {
        //     isEmail: true
        // },
        // allowNull: false
    },
    address: {
        type: Sequelize.STRING,
        // allowNull: false
    },
    token: {
        type: Sequelize.STRING
    }
});
