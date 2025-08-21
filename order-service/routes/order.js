const express = require("express");
const orderController = require("../controllers/order");

const router = express.Router();

router.post("/create-order", orderController.createOrder);
router.get("/", orderController.getUserOrders);
router.put("/update-status/:orderId", orderController.updateOrder);

module.exports = router;
