'use strict';
var router = require('express').Router(); // eslint-disable-line new-cap
var Products = require('../../../db/models/products.js');
var Category = require('../../../db/models/product_category.js');
var Review = require('../../../db/models/review.js');

module.exports = router;

router.get('/', function(req, res, next) {
  Products.findAll({})
  .then(function(products) {
    res.status(200).send(products);
  })
  .catch(next);
});

router.post('/', function(req, res, next) {
  Products.create(req.body)
  .then(function(product) {
    res.status(200).send(product);
  })
  .catch(next);
});

router.get('/:productId', function(req, res, next) {
  Products.findOne({where: {id: req.params.productId}, include: [Review, Category]})
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
  .then(function(product) {
    res.status(200).send(product[1][0]);
  })
  .catch(next);
});

router.delete('/:productId', function(req, res, next) {
  Products.destroy( {where: {id: req.params.productId}})
  .then(function(product) {
    res.status(204).send();
  })
  .catch(next);
});

//gets all products in a given category
//we have a belongsToMany relationship between products/category --> generates a getProducts() getter method
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

//returns all category types
router.get('/allcategories', function(req, res, next) {
  Category.findAll()
  .then(function(categories) {
    res.status(200).send(categories);
  })
  .catch(next);
});
