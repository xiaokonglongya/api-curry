var express = require("express");
var router = express.Router();
const apicall = require("./apicall");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("server", { title: "Express" });
});

router.post("/apitype",async function (req, res, next) {
  let result = await apicall.main(req);
  res.send(result);
});

module.exports = router;
