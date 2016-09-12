'use strict';
var crypto = require('crypto');
var _ = require('lodash');
var Sequelize = require('sequelize');
var db = require('../_db');
var Product = require('./product.js');
var User = require('./user.js');


module.exports = db.define('order', {
    status: {
      type: Sequelize.ENUM('In-Process', 'Complete'),
      allowNull: false
    }
}, {
  hooks: {
    //
  }
});



