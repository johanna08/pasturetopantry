'use strict';
var crypto = require('crypto');
var _ = require('lodash');
var Sequelize = require('sequelize');

var db = require('../_db');
var ProductCategory = require('./product_category.js');
var Review = require('./review');

module.exports = db.define('product', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    imageUrl: {
      type: Sequelize.STRING
    },
    quantity: {
      type: Sequelize.STRING
    }
}, {
  hooks: {
    //before save, if no imageUrl, have a default imageUrl to set
  }
});
