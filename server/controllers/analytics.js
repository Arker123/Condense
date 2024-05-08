const { spawnSync } = require("child_process");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const redisClient = require("../redisConfig");


const getAnalytics = async (req, res) => {
  // console.log(req.body);
  try {
    const { url } = req.body;
    console.log("url in backend :", url)
    // console.log(url + 'transcript');
    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    // const transcript = await redisClient.get("transcript-" + url);
    // if (transcript) {
    //   console.log("Cache hit for transcript");
    //   return res.status(200).json({
    //     transcript: JSON.parse(transcript),
    //     message: "Transcript generated successfully",
    //   });
    // }
    console.log("Cache miss, generating statistics...");

    const pythonProcess = spawnSync("python", [
      "../condense/analystics.py",
      "--url",
      url,
    ]);

    const dataToSend = await pythonProcess.stdout.toString();
    if (dataToSend) {
      await redisClient.set("statistics-" + url, JSON.stringify(dataToSend));
      res.status(200).json({
        statistics: JSON.stringify(dataToSend),
        message: "Transcript generated successfully",
      });
    } else {
      res.status(400).send({ message: "Error in getting transcript" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

module.exports = { getAnalytics };
