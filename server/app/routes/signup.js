const router = require('express').Router();
const db = require('../../db');
const User = db.model('user');

router.post('/', function(req, res, next){
  const sess = req.session;
  User.findOne({where : {email : req.body.email}})
  .then(function(result){
    if (result) {
       res.send("An account already exists with this email");
    }
    return User.create(req.body);
  })
  .then(function(user){
    sess.userId = user.id;
    res.status(201).send({ username: user.username, id: user.id });
  })
  .catch(next);
});
module.exports = router;
