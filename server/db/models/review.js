'use strict';
var crypto = require('crypto');
var _ = require('lodash');
var Sequelize = require('sequelize');
var db = require('../_db');
var Product = require('./products.js');
var User = require('./user.js');

module.exports = db.define('review', {
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
          len: [1, 500]
        }
    },
    rating: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
});

