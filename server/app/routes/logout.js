const router = require('express').Router();

router.post('/', function(req, res, next){
  req.session = null;
  res.sendStatus(204);
});

module.exports = router;
