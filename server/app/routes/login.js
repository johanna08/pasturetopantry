const router = require('express').Router();
const db = require('../../db');
const User = db.model('user');

router.post('/', function(req, res, next){
  const sess = req.session;
  User.findOne({where: {email: req.body.email}})
  .then(function(user){
    if (user) {
      if(user.correctPassword(req.body.password)) {
        //respond with username and id to avoid sending private info
        res.status(200).send({ username: user.username, id: user.id });
        sess.userId = user.id;
      } else {
        res.status(401).send("Incorrect password.");
      }
    } else {
      res.status(401).send("User not found.");
    }
  })
  .catch(next);
});
module.exports = router;
