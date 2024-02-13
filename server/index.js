const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoute = require("./routes/authRoute");
const mongoose = require("mongoose");

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

console.log(process.env)

const port = process.env.PORT || 5000;

app.use("/auth", authRoute);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to Database"))
  .then(() => {
<<<<<<< HEAD
    if(process.env.NODE_ENV != 'test'){
      app.listen(port, () => {
        console.log(`Server is running on ${port} `);
      });
    }
=======
    app.listen(port, () => {
      console.log(`Server is running on ${port} `);
    });
>>>>>>> d7144949899367253d45a6aff4a15bc3ef5dbd5e
  });

module.exports = app;
