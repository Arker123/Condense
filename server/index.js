const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoute = require("./routes/authRoute");
const mongoose = require("mongoose");

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.use("/auth", authRoute);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to Database"))
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on ${port} `);
    });
  });

module.exports = app;
