const express = require("express");

const router = express.Router();

const { getSuggestions } = require("../controllers/ai.controller");

router.post("/suggest", getSuggestions);

module.exports = router;
