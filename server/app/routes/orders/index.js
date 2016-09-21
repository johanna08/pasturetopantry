'use strict';

const router = require('express').Router(); // eslint-disable-line new-cap
const db = require('../../../db');
const User = db.model('user');
const Orders = db.model('order');
const Items = db.model('item');
const Products = db.model('product')

module.exports = router;

router.get('/', function(req, res, next) {
  Orders.findAll({include: [{model: User, attributes: ['email'] }, {model: Items, include: [Products]}]})
  .then(function(orders){
    res.status(200).send(orders);
  })
  .catch(next);
});

router.get('/:orderId', function(req, res, next) {
  Orders.findById(req.params.orderId, { include: [{model: Items, include: [Products] }, {model: User, attributes: ['email'] }] })
  .then(function(orders){
    res.status(200).send(orders);
  })
  .catch(next);
});

router.put('/:orderId', function(req, res, next) {
  Orders.findById(req.params.orderId)
  .then(function(order){
    order.update(req.body);
  })
  .then(function(order){
    res.status(200).send(order);
  })
  .catch(next);
});

router.delete('/:orderId', function(req, res, next) {
  Orders.destroy({where: { id: req.params.orderId} })
  .then(function(){
    res.status(204).send('order deleted');
  })
  .catch(next);
});

router.delete('/:orderId/product/:productId', function(req, res, next){
  Items.destroy({
    where: {
      productId: req.params.productId,
      orderId: req.params.orderId
    }
  })
  .then(function(){
    res.status(204).send("Item deleted");
  })
});
