const express = require("express");
const router = express.Router();

const { chat } = require("../controllers/chatController");
const patientProtect = require("../middleware/patientAuthMiddileware");

// router.post("/chat", patientProtect, chat);
router.post("/chat", chat);

module.exports = router;