const router = require('express').Router(); //
const db = require('../../../db');
const Category = db.model('category');

//returns all category types
router.get('/', function(req, res, next) {
  Category.findAll()
  .then(function(categories) {
    res.status(200).send(categories);
  })
  .catch(next);
});

//gets all products in a given category
router.get('/:categoryId', function(req, res, next) {
  Category.findOne({where: {id: req.params.categoryId}})
  .then(function(category) {
    return category.getProducts();
  })
  .then(function(products) {
    res.status(200).send(products);
  })
  .catch(next);
});

router.post('/', function(req, res, next) {
  Category.findOrCreate({where: req.body})
  .then(function(category) {
    res.status(201).send(category);
  })
  .catch(next);
});

router.delete('/:id', function(req, res, next) {
  Category.destroy({where: {id: req.params.id}})
  .then(function() {
    res.sendStatus(204);
  })
  .catch(next);
});

module.exports = router;
