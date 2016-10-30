const router = require('express').Router();
const db = require('../../db');
const User = db.model('user');

router.post('/', function(req, res, next){
  const sess = req.session;
  User.findOne({where: {email: req.body.email}})
  .then(function(user){
    if (!user) {res.status(401).send('User not found.');}
    else {
      if(user.correctPassword(req.body.password)){
      sess.userId = user.id;
      res.status(200).send(user.sanitize());
      } else {
        res.status(401).send('Incorrect login credentials.');
      }
    }
  })
  .catch(next);
});
module.exports = router;
