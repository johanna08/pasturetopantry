'use strict';
var db = require('./_db');
module.exports = db;

// eslint-disable-next-line no-unused-vars
var User = require('./models/user');
var Products = require('./models/products');
var Category = require('./models/product_category');
var Review = require('./models/review');
var Order = require('./models/order');

// if we had more models, we could associate them in this file
// e.g. User.hasMany(Reports)

User.hasMany(Review);
User.hasMany(Order);

//join table
Products.belongsToMany(Order, { through: 'product_of_order' });

//join table: a product can have multiple product types
Products.belongsToMany(Category, { through: 'product_category'});

Products.hasMany(Review);

