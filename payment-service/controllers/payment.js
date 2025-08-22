const stripe = require("stripe")(process.env.STRIPE_KEY);
const Payment = require("../models/payment");

exports.createPayment = async (req, res, next) => {
    try {
        const userId = req.get("X-User-Id");
        const orderId = req.params.orderId;
        const amount = req.body.amount;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            payment_method: req.body.paymentMethod,
            confirm: true,
        });
        const payment = new Payment({
            userId,
            orderId,
            amount,
            paymentIntentId: paymentIntent.id,
            status: paymentIntent.status,
            method: "stripe",
        });

        const result = await payment.save();

        res.status(200).json({ message: "Payment Done", payment: result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getPaymentById = async (req, res, next) => {
    const { paymentId } = req.params;

    try {
        const payment = await Payment.findById(paymentId);
        if (!payment)
            return res.status(404).json({ message: "Payment not found" });
        res.status(200).json({ message: "Payment fetched", payment });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getOrderPayment = async (req, res, next) => {
    const { orderId } = req.params;
    try {
        const payment = await Payment.findOne({ orderId });
        if (!payment)
            return res.status(404).json({ message: "Payment not found" });
        res.status(200).json({ message: "Payment fetched", payment });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};
