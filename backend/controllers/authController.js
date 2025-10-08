const express = require("express");
const router = express.Router();

// Temporary test route
router.get("/test", (req, res) => {
  res.json({ message: "Auth route working!" });
});

module.exports = router;
