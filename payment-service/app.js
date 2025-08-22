const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const paymentRouter = require("./routes/payment");

const app = express();

app.use(bodyParser.json());

app.use("/payment", paymentRouter);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("CONNECTED");
        app.listen(process.env.PORT);
    })
    .catch((err) => {
        console.log(err);
    });
