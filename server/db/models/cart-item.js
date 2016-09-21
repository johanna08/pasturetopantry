'use strict'
var Sequelize = require('sequelize');
var db = require('../_db');
var Products = db.model('product');
//item related an order to its quantity, orderID and productID
module.exports = db.define('item', {
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  instanceMethods: {
    reduceProductQuantity: function(quantity){
      return this.getProduct()
      .then(function(product){
        //console.log('LOOK HERES THE PRODUCT ', product);
           if (product.quantity - quantity < 0) throw new Error('Insufficient Inventory');
            let newQuantity = product.quantity - quantity;
            // console.log("LOOK HERES THE PRODUCT QUANTINTY", product.quantity);
            console.log("LOOK HERES THE NEW QUANTINTY", newQuantity);
            return product.update({quantity:  newQuantity});
      })
    }
  }
});
