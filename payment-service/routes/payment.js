const express = require("express");
const paymentController = require("../controllers/payment");

const router = express.Router();

router.post("/create-payment/:orderId", paymentController.createPayment);
router.get("/:paymentId", paymentController.getPaymentById);
router.get("/:orderId", paymentController.getOrderPayment);

module.exports = router;
