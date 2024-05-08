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
const { spawn } = require('child_process'); 

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

const { WebSocketServer } = require("ws");
const sockserver = new WebSocketServer({ port: 443 });
sockserver.on("connection", (ws) => {
  console.log("New client connected!");

  const pythonProcess = spawn("python", ["../condense/g_meet_summarizer.py"]);

  pythonProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });
  pythonProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
    ws.send(data);
  });


  ws.on("close", () => {
    pythonProcess.kill();
    console.log("Client has disconnected!");
  });
  
  ws.onerror = function () {
    console.log("websocket error");
  };
});

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
