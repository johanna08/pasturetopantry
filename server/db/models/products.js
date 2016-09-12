'use strict';
var crypto = require('crypto');
var _ = require('lodash');
var Sequelize = require('sequelize');

var db = require('../_db');

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
      type: Sequelize.STRING,
      allowNull: false
    },
    source: {
      type: Sequelize.STRING,
      allowNull: false
    }
}, {
  hooks: {
    //before save, if no imageUrl, have a default imageUrl to set
  }
});
