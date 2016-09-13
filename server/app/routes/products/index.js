'use strict';
var router = require('express').Router(); // eslint-disable-line new-cap
const db = require('../../../db');
const Products = db.model('product');
const Category = db.model('category');
const Review = db.model('review');

module.exports = router;

router.get('/', function(req,res,next){
  Products.findAll()
  .then(function(response){
    res.send(response);
  })
  .catch(next);
});

router.get('/:productId', function(req, res, next) {
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

router.get('/categories/:category', function(req, res, next) {
  Category.findOne({where: {type_name: req.params.category}})
  .then(function(category) {
    return category.getProducts();
  })
  .then(function(products) {
    res.status(200).send(products);
  })
  .catch(next);
});
