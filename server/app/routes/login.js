const router = require('express').Router();
const db = require('../../db');
const User = db.model('user');

router.post('/', function(req, res, next){
  const sess = req.session;
  User.findOne({where: req.body})
  .then(function(user){
    if (user) {
      res.status(200).send(user.id);
      sess.userId = user.id;
    } else {
      res.status(401).send(null);
    }
  })
  .catch(next);
});
module.exports = router;
