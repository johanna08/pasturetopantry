const router = require('express').Router();

router.post('/', function(req, res, next){
  req.session = null;
  res.status(200).send("success");
});

module.exports = router;
