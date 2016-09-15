const router = require('express').Router(); // eslint-disable-line new-cap
const db = require('../../../db');
const Products = db.model('product');
const Orders = db.model('order');
const Items = db.model('item');
const Promise = require('sequelize').Promise;

router.param('userId', function(req, res, next, userId) {
  Orders.findOrCreate({
    where: {
      userId: req.params.userId,
      status: 'Active'
    },
    include: [{
       model: Items,
       include: [Products]
    }]
  })
  .spread(function(order){
      req.order = order;
      next();
  })
  .catch(next);
});

//get the active order for a given user
router.get('/:userId', function(req, res, next){
  res.status(200).send(req.order);
});

// example response:
// {
//   "id": 1,
//   "status": "Active",
//   "createdAt": "2016-09-15T16:50:36.926Z",
//   "updatedAt": "2016-09-15T16:50:37.013Z",
//   "userId": 1,
//   "items": [
//     {
//       "id": 1,
//       "quantity": 1,
//       "createdAt": "2016-09-15Ts16:50:36.943Z",
//       "updatedAt": "2016-09-15T16:50:37.036Z",
//       "orderId": 1,
//       "productId": 2,
//       "product": {
//         "id": 2,
//         "name": "bananas",
//         "price": 1,
//         "description": "free-trade bananas",
//         "imageUrl": "http://pngimg.com/upload/banana_PNG835.png",
//         "quantity": "1",
//         "source": "Jo's Farm",
//         "createdAt": "2016-09-15T16:50:36.882Z",
//         "updatedAt": "2016-09-15T16:50:36.882Z"
//       }
//     },
//     {
//       "id": 2,
//       "quantity": 3,
//       "createdAt": "2016-09-15T16:50:36.943Z",
//       "updatedAt": "2016-09-15T16:50:37.036Z",
//       "orderId": 1,
//       "productId": 3,
//       "product": {
//         "id": 3,
//         "name": "eggs",
//         "price": 5,
//         "description": "free-range, grass-fed",
//         "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/e/ee/Egg_colours.jpg",
//         "quantity": "12",
//         "source": "Jo's Farm",
//         "createdAt": "2016-09-15T16:50:36.882Z",
//         "updatedAt": "2016-09-15T16:50:36.882Z"
//       }
//     }
//   ]
// }

//merges current cart items with those in the db
router.put('/:userId/merge', function(req, res, next){
  const updates = req.body.updates;
    var updatePromises = updates.map(function(update){
      Items.findOne({
        where : {
          productId: update.productId,
          orderId: req.order.id
        }
      })
      .then(function(item){
        if (item){
          return item.update({ quantity: update.quantity});
        } else {
          return Items.create({ quantity: update.quantity})
          .then(function(created){
            return created.setOrder(req.order.id);
          })
          .then(function(created){
            return created.setProduct(update.productId);
          });
        }
      });
    });

    Promise.all(updatePromises)
    .then(function(){
      res.status(200).send('updated');
    }).catch(next);
});

//checkout
router.put('/:userId/checkout', function(req, res, next){
  //array of items in cart -->can access each productId of item
  //do a request to find all items in an order, include Products-->use this to access product instances
  let products = req.order.items;

});

//remove all items from a cart
router.delete('/:userId', function(req, res, next){
  Items.destroy({
    where: {
      orderId: req.order.id
    }
  })
  .then(function(){
    res.status(204).send("Cart emptied");
  });
});

//removes a specific item from an order
router.delete('/:userId/product/:productId', function(req, res, next){
  Items.destroy({
    where : {
      productId: req.params.productId,
      orderId: req.order.id
    }
  })
  .then(function(){
    res.status(204).send("Item deleted");
  })
});


module.exports = router;
