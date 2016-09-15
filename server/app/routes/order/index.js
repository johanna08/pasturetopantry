const router = require('express').Router(); // eslint-disable-line new-cap
const db = require('../../../db');
const Products = db.model('product');
const Orders = db.model('order');
const Items = db.model('item');

router.param('userId', function(req, res, next, userId) {
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
    req.order = order;
    next();
  })
  .catch(next);
});

//get all active orders
router.get('/:userId', function(req, res, next){
  //filter by active
  res.status(200).send(req.order);

  // Orders.findOne({
  //   where: {
  //     userId: req.params.userId,
  //     status: 'Active'
  //   },
  //   include: [{
  //      model: Items,
  //      include: [Products]
  //   }]
  // })
  // .then(function(order){
  //   res.send(order);
  // })
  // .catch(next);

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

router.put('/:userId/merge', function(req, res, next){
  const items = req.body;
  // for (let item of items){
  //   Orders.findOne( where: {
  //     userId: req.params.userId,
  //     status: 'Active'
  //   });
  // }

});

module.exports = router;
