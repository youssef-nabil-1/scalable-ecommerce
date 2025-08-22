const express = require("express");
const bodyParser = require("body-parser");
const notificationtRouter = require("./routes/notifcation");

const app = express();

app.use(bodyParser.json());

app.use("/notification", paymentRouter);
app.listen(process.env.PORT);
