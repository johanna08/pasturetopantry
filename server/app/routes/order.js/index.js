var router = require('express').Router(); // eslint-disable-line new-cap
const db = require('../../../db');
const Products = db.model('product');
const Orders = db.model('order');

//get all active orders
router.get('/:userId', function(req, res, next){
  //filter by active
  Orders.findAll({
    where: req.params,
    include: [Products]
  })
  .then(function(order){
    res.send(order);
  })
  .catch(next);

});

module.exports = router;
