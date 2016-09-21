'use strict';

const router = require('express').Router(); // eslint-disable-line new-cap
const db = require('../../../db');
const User = db.model('user');
const Orders = db.model('order');
const Items = db.model('item');
const Products = db.model('product')
const Reviews = db.model('review')

module.exports = router;

//get all users, include their orders, items in each order, products in each item
//note: properties are within properties based on how they are included.
//will return users object -->will have orders property this is an array of orders objects
  //orders property will have items property that is an array of items object -->each items object will have product property
router.get('/', function(req, res, next) {
  User.findAll({include: [{model: Orders, include: [{model: Items, include: [Products] }] }], attributes: {exclude: ['password', 'twitter_id', 'salt', 'google_id', 'facebook_id'] }})
  .then(function(allUsers){
    res.status(200).send(allUsers);
  })
  .catch(next);
});

//gets one user, has numerous includes that create same object above with the addition of the reviews property on the user object.
router.get('/:userId', function(req, res, next) {
  User.findById(req.params.userId, {include: [{model: Orders, include: [{model: Items, include: [Products] }] }, Reviews], attributes: {exclude: ['password', 'salt', 'google_id', 'twitter_id', 'facebook_id'] } })
  .then(function(user){
    res.status(200).send(user);
  })
  .catch(next);
});

//delete user
router.delete('/:userId', function(req, res, next) {
  User.destory({where: {id: req.params.userId} })
  .then(function(){
    res.status(204).send();
  })
  .catch(next);
});

//update user
router.put('/:userId', function(req, res, next) {
  User.findById(req.params.userId)
  .then(function(user) {
    user.update(req.body)
  })
  .then(function(user){
    res.status(200).send(user);
  })
  .catch(next);
});
