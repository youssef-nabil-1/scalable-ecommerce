const express = require("express");
const userContoller = require("../controllers/user");

const router = express.Router();

router.post("/register", userContoller.createUser);

module.exports = router;
