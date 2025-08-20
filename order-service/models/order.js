const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        items: [
            {
                productId: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
        },
        status: { type: String, default: "Pending" },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", orderSchema);
