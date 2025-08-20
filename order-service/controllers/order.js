const axios = require("axios");
const Order = require("../models/order");

exports.createOrder = async (req, res, next) => {
    try {
        const authHeader = req.get("authorization");
        if (!authHeader) {
            return res.status(401).json({ message: "No authorization header" });
        }
        let isAuth;
        try {
            isAuth = await axios.post(
                process.env.AUTH_SERVICE + "/auth/isAuth",
                {
                    token: authHeader.split(" ")[1],
                }
            );
        } catch (authError) {
            if (authError.status === 401)
                return res.status(401).json({ message: "Unauthorized" });
            return res
                .status(500)
                .json({ message: "Authentication service error" });
        }
        const userId = isAuth.data.decoded.userId;

        const response = await axios.get(process.env.CART_SERVICE + "/cart/", {
            headers: {
                Authorization: `Bearer ${authHeader.split(" ")[1]}`,
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
                Authorization: `Bearer ${authHeader.split(" ")[1]}`,
            },
        });

        res.status(201).json({ message: "Order Created", order });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Order creation error" });
    }
};
