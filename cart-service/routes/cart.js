const express = require("express");
const cartController = require("../controllers/cart");

const router = express.Router();

router.post("/add/:prodId", cartController.addPoduct);
router.delete("/remove/:prodId", cartController.removeProduct);
router.get("/", cartController.getCart);

module.exports = router;
