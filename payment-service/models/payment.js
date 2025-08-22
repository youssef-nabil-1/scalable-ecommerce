const mongoose = reqiure("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
    {
        orderId: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        paymentIntentId: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        method: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
