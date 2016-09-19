'use strict';
const crypto = require('crypto');
const _ = require('lodash');
const Sequelize = require('sequelize');

const db = require('../_db');

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
      type: Sequelize.TEXT('medium'),
      allowNull: false
    },
    imageUrl: {
      type: Sequelize.STRING,
      defaultValue: 'http://www.fillmurray.com/g/200/200'
    },
    quantity: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    source: {
      type: Sequelize.STRING,
      allowNull: false
    }
}, {
  instanceMethods: {
    reduceQuantity: function(quantity) {
      if (this.quantity - quantity < 0) {
        throw new Error('Insufficient Inventory');
      }
      this.quantity -= quantity;
    }
  },

  getterMethods: {
    dollarPrice: function(){
      let dollars = this.price / 100;
      return dollars.toFixed(2);
    }
  }
});
