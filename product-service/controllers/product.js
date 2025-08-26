const axios = require("axios");
const Product = require("../models/product");

exports.createProduct = async (req, res, next) => {
	try {
		const userId = req.get("X-User-Id");

		const { name, price, discription, category, stock } = req.body;
		const product = new Product({
			name,
			price,
			discription,
			category,
			stock,
			ownerId: userId,
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

exports.getProducts = async (req, res, next) => {
	try {
		const products = await Product.find();
		res.status(200).json({ message: "Products fetched", products });
	} catch (err) {
		console.error("Product fetching error:", err);
		return res.status(500).json({
			message: "Server error",
			error: err.message,
		});
	}
};

exports.getProductById = async (req, res, next) => {
	try {
		const prodId = req.params.prodId;
		const product = await Product.findById(prodId);
		if (!product) {
			return res.status(404).json({
				message: "Could not find product with this id",
			});
		}
		console.log(product);
		return res.status(200).json({ message: "Product fetched", product });
	} catch (err) {
		console.error("Product fetching error:", err);
		return res.status(500).json({
			message: "Server error",
			error: err.message,
		});
	}
};

exports.deleteProduct = async (req, res, next) => {
	try {
		const userId = req.get("X-User-Id");
		console.log(userId);

		const prodId = req.params.prodId;
		const product = await Product.findById(prodId);

		if (product.ownerId !== userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		const result = await Product.findByIdAndDelete(prodId);
		res.status(200).json({
			message: "Product deleted successfully",
			product: result,
		});
	} catch (err) {
		console.error("Product deletion error:", err);
		return res.status(500).json({
			message: "Server error",
			error: err.message,
		});
	}
};
