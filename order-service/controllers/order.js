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

exports.updateOrder = async (req, res, next) => {};
