const router = require('express').Router();
const db = require('../../db');
const User = db.model('user');

router.post('/', function(req, res, next){
  const sess = req.session;
  User.create(req.body)
  .then(function(user){
    sess.userId = user.id;
    res.status(201).send(user.id);
  })
  .catch(next);
});
module.exports = router;
