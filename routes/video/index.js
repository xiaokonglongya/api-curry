var express = require("express");
var router = express.Router();
let downVideoFile = require("./download");

/* GET home page. */
router.post("/download", async function (req, res, next) {
  let result = await downVideoFile.downfile(req);
  res.send(result);
});

module.exports = router;
