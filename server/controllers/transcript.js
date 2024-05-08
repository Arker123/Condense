// import {spawn} from 'child_process'
const { spawnSync } = require("child_process");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const redisClient = require("../redisConfig");

// Your other codes

const getTs = async (req, res) => {
  const form = formidable.formidable({});
  console.log("In getTs", form);
  let oldPath;
  let newPath;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form:", err);
      res.status(500).send({ error: "Error parsing form" });
      return;
    }

    console.log(files["file"]);

    // console.log(files[0]);
    // Assuming 'file' is the name of the field for the uploaded file
    const uploadedFile = files["file"];

    // console.log("UPLOADED", uploadedFile, uploadedFile[0].filepath);

    // Move the file to a permanent location on the server
    oldPath = uploadedFile[0].filepath;

    const summary = await redisClient.get(oldPath);
    if (summary !== "" && summary !== null) {
      console.log("Cache hit");
      return res.status(200).json({
        summary: summary,
        message: "Summary generated successfully",
      });
    }

    console.log("Old pathhhhh", oldPath);
    newPath = path.join(
      __dirname,
      "uploads",
      uploadedFile[0].originalFilename || "File"
    );

    fs.rename(oldPath, newPath, async (err) => {
      if (err) {
        console.error("Error moving file:", err);
        res.status(500).send({ error: "Error moving file" });
        return;
      }

      // Respond with success message and the file path
      // res.send({ success: true, filePath: newPath });

      console.log("Cacheee miss, generating transcript...");
      console.log(oldPath);

      const pythonProcess = spawnSync("condense", [
        newPath,
        "--only",
        "summary"
      ]);

      console.log("Python process error: ", pythonProcess.stderr.toString());
      console.log("Python process output: ", pythonProcess.stdout.toString());
      
      const dataToSend = pythonProcess.stdout.toString();

      console.log("DATAAAAAAA: ", dataToSend);
      if (dataToSend) {
        await redisClient.set(oldPath, dataToSend);
        res.status(200).json({
          transcript: dataToSend,
          message: "Transcript generated successfully",
        });
      } else {
        res.status(400).send({ message: "Error in getting transcript" });
      }

    });
  });  
};

const getTranscript = async (req, res) => {
  // console.log(req.body);
  try {
    const { url } = req.body;
    // console.log(url + 'transcript');
    if (!url) {
      return res.status(400).json({ message: "File is required" });
    }

    const transcript = await redisClient.get("transcript-" + url);
    if (transcript) {
      console.log("Cache hit for transcript");
      return res.status(200).json({
        transcript: JSON.parse(transcript),
        message: "Transcript generated successfully",
      });
    }
    console.log("Cache miss, generating transcript...");

    const pythonProcess = spawnSync("python", [
      "../condense/transcript.py",
      "--url",
      url,
    ]);

    const dataToSend = await pythonProcess.stdout.toString();

    if (dataToSend) {
      await redisClient.set("transcript-" + url, JSON.stringify(dataToSend));
      res.status(200).json({
        transcript: dataToSend,
        message: "Transcript generated successfully",
      });
    } else {
      res.status(400).send({ message: "Error in getting transcript" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

module.exports = { getTranscript, getTs };
