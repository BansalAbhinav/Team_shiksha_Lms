const express = require("express");
const router = express.Router();
const { getTest } = require("../controllers/testController");

router.get("/test", getTest);

module.exports = router;


