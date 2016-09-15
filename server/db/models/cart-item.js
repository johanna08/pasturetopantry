var Sequelize = require('sequelize');
var db = require('../_db');
//item related an order to its quantity, orderID and productID
module.exports = db.define('item', {
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});
