const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");

const productRoutes = require("./routes/product");

const app = express();

app.use(bodyparser.json());

app.use("/product", productRoutes);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("CONNECTED");
        app.listen(process.env.PORT);
    })
    .catch((err) => {
        console.log(err);
    });
