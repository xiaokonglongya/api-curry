var express = require("express");
var router = express.Router();
let downVideoFile = require("./download");
const mergeVideo = require("./megerVideo");
/* GET home page. */
router.post("/download", async function (req, res, next) {
  let result = await downVideoFile.downfile(req);
  res.send(result);
});
router.post("/merge", async function (req, res, next) {
  let result = await mergeVideo.main(req);
  res.send(result);
});

module.exports = router;
