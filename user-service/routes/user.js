const express = require("express");
const userContoller = require("../controllers/user");

const router = express.Router();

router.post("/register", userContoller.createUser);
router.post("/login", userContoller.login);
router.get("/verify", userContoller.isAuth);

module.exports = router;
