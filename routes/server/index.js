var express = require("express");
var router = express.Router();
const apicall = require("./apicall");

router.post("/apitype", async function (req, res, next) {
  let result = await apicall.addtype(req);
  res.send(result);
});

router.get("/", async function (req, res, next) {
  let result = await apicall.main(req);
  res.send(result);
});
router.get("/apitype/:code", async function (req, res, next) {
  let result = await apicall.getOnceByCode(req);
  res.send(result);
});

module.exports = router;
