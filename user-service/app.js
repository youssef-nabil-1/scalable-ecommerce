const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");

const userRoutes = require("./routes/user");

const app = express();

app.use(bodyparser.json());

app.use("/auth", userRoutes);

mongoose
    .connect(process.env.MONGO_URI)
    .then((res) => {
        console.log("CONNECTED");
        app.listen(process.env.PORT);
    })
    .catch((err) => {
        console.log(err);
    });
