'use strict';

const router = require('express').Router(); // eslint-disable-line new-cap
const db = require('../../../db');
const User = db.model('user');
const Orders = db.model('order');
const Items = db.model('item');

module.exports = router;

router.get('/', function(req, res, next) {
  Orders.findAll({include: [{model: User, attributes: ['email'] }]})
  .then(function(orders){
    res.status(200).send(orders);
  })
  .catch(next);
});

router.get('/:orderId', function(req, res, next) {
  Orders.findById(req.params.orderId, { include: [Items]})
  .then(function(orders){
    res.status(200).send(orders);
  })
  .catch(next);
});
