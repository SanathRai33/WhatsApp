const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload.middleware");

const { uploadMedia } = require("../controllers/media.controller");

router.post("/upload", upload.single("media"), uploadMedia);

module.exports = router;
