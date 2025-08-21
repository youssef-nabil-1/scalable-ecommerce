const Cart = require("../models/cart");

exports.addPoduct = async (req, res, next) => {
    try {
        const userId = req.get("X-User-Id");
        const { prodId } = req.params;
        let cart = await Cart.findOne({ ownerId: userId });
        if (!cart) {
            cart = new Cart({
                ownerId: userId,
                items: [{ productId: prodId, quantity: 1 }],
            });
            const result = await cart.save();
            return res
                .status(201)
                .json({ message: "Product added", cart: result });
        }
        const index = cart.items.findIndex((i) => i.productId === prodId);
        if (index === -1) {
            cart.items.push({ productId: prodId, quantity: 1 });
        } else {
            cart.items[index].quantity += 1;
        }
        const result = await cart.save();
        res.status(201).json({ message: "Product added", cart: result });
    } catch (err) {
        console.error("Product adding error:", err);
        return res.status(500).json({
            message: "Server error",
            error: err.message,
        });
    }
};

exports.removeProduct = async (req, res, next) => {
    try {
        const userId = req.get("X-User-Id");
        const { prodId } = req.params;
        let cart = await Cart.findOne({ ownerId: userId });
        if (!cart) {
            return res.status(404).json({ message: "No product found" });
        }
        const index = cart.items.findIndex((i) => i.productId === prodId);
        if (index === -1) {
            return res.status(404).json({ message: "No product found" });
        } else {
            if (cart.items[index].quantity === 1) {
                cart.items = cart.items.filter((i) => i.productId !== prodId);
            } else cart.items[index].quantity -= 1;
        }
        const result = await cart.save();
        res.status(201).json({ message: "Product removed", cart: result });
    } catch (err) {
        console.error("Product removing error:", err);
        return res.status(500).json({
            message: "Server error",
            error: err.message,
        });
    }
};

exports.getCart = async (req, res, next) => {
    try {
        const userId = req.get("X-User-Id");
        let cart = await Cart.findOne({ ownerId: userId });
        if (!cart) {
            cart = { ownerId: userId, items: [] };
        }
        res.status(200).json({ message: "Cart fetched", cart });
    } catch (err) {
        console.error("Product removing error:", err);
        return res.status(500).json({
            message: "Server error",
            error: err.message,
        });
    }
};

exports.removeCart = async (req, res, next) => {
    try {
        const userId = req.get("X-User-Id");
        let cart = await Cart.deleteOne({ ownerId: userId });
        res.status(200).json({ message: "Cart removed", cart });
    } catch (err) {
        console.error("Cart removing error:", err);
        return res.status(500).json({
            message: "Server error",
            error: err.message,
        });
    }
};
