const axios = require("axios");
const Order = require("../models/order");

exports.createOrder = async (req, res, next) => {
    try {
        const userId = req.get("X-User-Id");

        const response = await axios.get(process.env.CART_SERVICE + "/cart/", {
            headers: {
                "X-User-Id": userId,
            },
        });
        const cart = response.data.cart;

        const items = await Promise.all(
            cart.items.map(async (i) => {
                const response = await axios.get(
                    process.env.PRODUCT_SERVICE + `/product/${i.productId}`
                );
                const [prod] = response.data.product;
                return { prod, quantity: i.quantity };
            })
        );
        const totalAmount = items.reduce((sum, second) => {
            return sum + second.prod.price * second.quantity;
        }, 0);

        const order = new Order({
            userId,
            totalAmount,
            items: [...cart.items],
        });
        const result = await order.save();

        await axios.delete(process.env.CART_SERVICE + "/cart/remove-cart", {
            headers: {
                "X-User-Id": userId,
            },
        });

        res.status(201).json({ message: "Order Created", order });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Order creation error" });
    }
};

exports.updateOrder = async (req, res, next) => {
    try {
        const userId = req.get("X-User-Id");
        const orderId = req.params.orderId;

        const order = await Order.findById(orderId);
        if (!order || order.userId !== userId)
            return res.status(404).json({ message: "Could not find order" });
        order.status = "Completed";
        await order.save();
        res.status(201).json({ message: "Order status updated", order });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getUserOrders = async (req, res, next) => {
    try {
        const userId = req.get("X-User-Id");
        const orders = await Order.find({ userId });
        res.status(200).json({ message: "Orders fetched", orders });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};
