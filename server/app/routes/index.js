'use strict';
var router = require('express').Router(); // eslint-disable-line new-cap
module.exports = router;
var db = require('../../db');
var Order = db.model('order');

router.use('/members', require('./members'));

router.get('/cart', function (req, res) {
    Order.findAll({})
    .then(function(orders) {
        console.log('orders:', order.data);
        res.send(orders.data);
    });
});

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
