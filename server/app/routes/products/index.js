'use strict';
var router = require('express').Router(); // eslint-disable-line new-cap
const db = require('../../../db');
const Products = db.model('product');
const Category = db.model('category');
const Review = db.model('review');

module.exports = router;

router.get('/', function(req, res, next) {
  Products.findAll({})
  .then(function(products) {
    res.send(products);
  })
  .catch(next);
});

router.post('/', function(req, res, next) {
  Products.create(req.body.product)
  .then(function(product) {
    product.setCategories(req.body.categories);
    res.status(200).send(product);
  })
  .catch(next);
});

router.get('/item/:productId', function(req, res, next) {
  Products.findOne({where: {id: req.params.productId}, include: [Review]})
  .then(function(product) {
    if (!product) {
      var err = new Error('Product does not exist!');
      err.status = 404;
      throw err;
    }
    res.status(200).send(product);
  })
  .catch(next);
});

router.put('/:productId', function(req, res, next) {
  Products.update( req.body, {where: {id: req.params.productId}, returning: true})
  .then(function(response) {
    res.send(response[1][0]);
  })
  .catch(next);
});

router.delete('/:productId', function(req, res, next) {
  Products.destroy( {where: {id: req.params.productId}})
  .then(function() {
    res.status(204).send();
  })
  .catch(next);
});


