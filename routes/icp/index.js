/**
 * ICP备案相关路由
 */

var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  let params = req.query;
  const { url = "" } = params;
  let result = {
    code: 200,
    url,
  };
  res.send(result);
});

module.exports = router;
