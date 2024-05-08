const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/authRoute");
const summaryRoute = require("./routes/summaryRoute");
const noteRoute = require("./routes/noteRoute");
const transcriptRoute = require("./routes/transcriptRoute");
const analyticsRoute = require("./routes/analyticsRoute")
const chatbotRoute = require("./routes/chatbotRoute");
const userRoute = require("./routes/userRoute");
const redisClient = require("./redisConfig.js");

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.use("/auth", authRoute);
app.use("/note", noteRoute);
app.use("/user", userRoute);
app.use("/summaries", summaryRoute);
app.use("/transcript", transcriptRoute);
app.use("/youtube-stats", analyticsRoute)
app.use("/chatbot", chatbotRoute);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to Database"))
  .then(() => {
    redisClient.connect();
  })
  .then(() => {
    if (process.env.NODE_ENV != "test") {
      app.listen(port, () => {
        console.log(`Server is running on ${port} `);
      });
    }
  })
  .catch((err) => console.log(err));

module.exports = app;
