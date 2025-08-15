const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discription: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model("Product", productSchema);
