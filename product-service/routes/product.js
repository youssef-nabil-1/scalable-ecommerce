const express = require("express");
const productController = require("../controllers/product");

const router = express.Router();

router.post("/create", productController.createProduct);
router.get("/", productController.getProducts);
router.get("/:prodId", productController.getProductById);
router.delete("/:prodId", productController.deleteProduct);

module.exports = router;
