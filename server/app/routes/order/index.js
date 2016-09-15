const router = require('express').Router(); // eslint-disable-line new-cap
const db = require('../../../db');
const Products = db.model('product');
const Orders = db.model('order');
const Items = db.model('item');
//get all active orders
router.get('/:userId', function(req, res, next){
  //filter by active
  Orders.findOne({
    where: {
      userId: req.params.userId,
      status: 'Active'
    },
    include: [{
       model: Items,
       include: [Products]
    }]
  })
  .then(function(order){
    res.send(order);
  })
  .catch(next);

});

module.exports = router;
