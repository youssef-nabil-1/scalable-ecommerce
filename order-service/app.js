const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const orderRouter = require("./routes/order");

const app = express();

app.use(bodyParser.json());

app.use("/order", orderRouter);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("CONNECTED");
        app.listen(process.env.PORT);
    })
    .catch((err) => {
        console.log(err);
    });
