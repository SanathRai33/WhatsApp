const express = require("express");

const router = express.Router();

const {
  signup,
  login,
  checkUserByEmail,
} = require("../controllers/auth.controller");

router.post("/signup", signup);

router.post("/login", login);

router.get("/check-user", checkUserByEmail);

module.exports = router;
