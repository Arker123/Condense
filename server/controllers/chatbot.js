const Summary = require("../models/summaryModel");
const User = require("../models/UserModel");
const redisClient = require("../redisConfig.js");

const { spawnSync } = require("child_process");

const generateResponse = async (req, res) => {
  try {
    const { summary, question } = req.body;
    if (!summary) return res.status(400).send("Summary/context is required");
    if (!question) return res.status(400).send("Question is not provided");

    const pythonProcess = spawnSync("python", [
      "../condense/chatbot.py",
      "--summary",
      summary,
      "--question",
      question,
    ]);

    const dataToSend = await pythonProcess.stdout.toString();
    res.status(200).json({
      response: dataToSend,
      message: "Response generated successfully",
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

module.exports = {
  generateResponse,
};
