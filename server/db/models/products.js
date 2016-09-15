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
      type: Sequelize.FLOAT,
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
      type: Sequelize.INTEGER,
      allowNull: false
    },
    source: {
      type: Sequelize.STRING,
      allowNull: false
    }
}, {
  instanceMethods: {
    reduceQuantity: function(quantity) {
      if(this.quantity - quantity < 0) throw new Error('Insufficient Inventory');
      this.quantity -= quantity;
    }
  }
});
