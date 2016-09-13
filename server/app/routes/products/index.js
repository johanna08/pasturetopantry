'use strict';
var router = require('express').Router(); // eslint-disable-line new-cap
var Products = require('../../../db/models/products.js');
var Category = require('../../../db/models/product_category.js');
var Review = require('../../../db/models/review.js');

module.exports = router;

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
