'use strict';
var router = require('express').Router(); // eslint-disable-line new-cap
module.exports = router;

router.use('/categories', require('./category'));
router.use('/members', require('./members'));
router.use('/products', require('./products'));
router.use('/signup', require('./signup'));
router.use('/login', require('./login'));
router.use('/logout', require('./logout'));
router.use('/order', require('./order'));
// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
