'use strict';

var db = require('./_db');
module.exports = db;

// eslint-disable-next-line no-unused-vars
var User = require('./models/user');
var Products = require('./models/products');
var Category = require('./models/product_category');
var Review = require('./models/review');
var Order = require('./models/order');
var Item = require('./models/cart-item');
var OrderDetail = require('./models/order-details');

// if we had more models, we could associate them in this file
// e.g. User.hasMany(Reports)

User.hasMany(Review);
User.hasMany(Order);

// //join table
// Order.belongsToMany(Products, { through: 'productOfOrder' });

//join table: a product can have multiple product types
Products.belongsToMany(Category, { through: 'productCategory'});
Category.belongsToMany(Products, {through: 'productCategory'});

//Join tables for item with order and product
Item.belongsTo(Order);
Order.hasMany(Item);
Item.belongsTo(Products);

//join order details with cart details
OrderDetail.belongsTo(Order);

Products.hasMany(Review);
