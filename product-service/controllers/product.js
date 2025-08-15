const axios = require("axios");
const Product = require("../models/product");

exports.createProduct = async (req, res, next) => {
    try {
        const authHeader = req.get("authorization");
        if (!authHeader) {
            return res.status(401).json({ message: "No authorization header" });
        }
        try {
            const isAuth = await axios.post(process.env.AUTH_SERVICE, {
                token: authHeader.split(" ")[1],
            });
            if (!isAuth.data) {
                return res.status(401).json({ message: "Unauthorized" });
            }
        } catch (authError) {
            return res
                .status(500)
                .json({ message: "Authentication service error" });
        }

        const { name, price, discription, category, stock } = req.body;
        const product = new Product({
            name,
            price,
            discription,
            category,
            stock,
        });

        const result = await product.save();
        return res.status(201).json({
            message: "Product Created",
            product: result,
        });
    } catch (err) {
        console.error("Product creation error:", err);
        return res.status(500).json({
            message: "Server error",
            error: err.message,
        });
    }
};
