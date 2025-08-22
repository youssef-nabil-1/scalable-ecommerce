const express = require("express");
const notificationController = require("../controllers/notification");

const router = express.Router();

router.post("/email/", notificationController.sendEmail);

module.exports = router;
