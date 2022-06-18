/**
 * ICP备案相关路由
 */
var express = require("express");
var router = express.Router();
const axios = require("axios");
const BaseResponse = require("../../utils/baseResponse");
/* GET home page. */
router.get("/", async function (req, res, next) {
  let params = req.query;
  const { url = "" } = params;
  if (!url) {
    res.send(response.fail("缺少参数"));
  }
  const { data } = await axios.get("https://api.oick.cn/icp/api.php", {
    params: { url },
  });
  if (data?.code === 200) {
    delete data.code;
    res.send(new BaseResponse().success(data));
  } else {
    res.send(new BaseResponse().fail(data.msg));
  }
});

module.exports = router;
