/**
 * ICP备案相关路由
 */

var express = require("express");
var router = express.Router();
const axios = require("axios");
/* GET home page. */
router.get("/", async function (req, res, next) {
  let params = req.query;
  const { url = "" } = params;
  if (!url) {
    res.send({
      code: 0,
      meg: "url为空",
    });
  }
  const { data } = await axios.get("https://api.oick.cn/icp/api.php", {
    params: { url },
  });
  res.send(data);
});

module.exports = router;
