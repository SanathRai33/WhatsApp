const express = require("express");

const router = express.Router();

const { sendMessage } = require("../controllers/message.controller");

router.post("/send", sendMessage);

module.exports = router;
