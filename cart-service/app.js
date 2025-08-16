const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

const cartRoutes = require("./routes/cart");

const app = express();

app.use(bodyparser.json());
app.use("/cart", cartRoutes);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("CONNECTED");
        app.listen(process.env.PORT);
    })
    .catch((err) => {
        console.log(err);
    });
