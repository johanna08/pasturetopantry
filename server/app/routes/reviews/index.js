'use strict';
var router = require('express').Router(); // eslint-disable-line new-cap
const db = require('../../../db');
const Review = db.model('review');

module.exports = router;

router.get('/', function(req, res, next) {
  Review.findAll()
  .then(function(reviews) {
    res.status(200).send(reviews);
  })
  .catch(next);
});

//update review
router.put('/:reviewId', function(req, res, next) {
  Review.findById(req.params.reviewId)
  .then(function(review) {
    return review.update(req.body);
  })
  .then(function(review) {
    res.status(200).send(review);
  })
  .catch(next);
});

//post a review
//review takes title, content, rating -->association with product & user
router.post('/user/:userId/product/:productId', function(req, res, next) {
  Review.create(req.body)
  .then(function(review) {
    return review.setProduct(req.params.productId);
  })
  .then(function(review) {
    review.setUser(req.params.userId);
  })
  .then(function(review) {
    res.status(200).send(review);
  })
  .catch(next);
});

