// import {spawn} from 'child_process'
const { spawnSync } = require("child_process");

const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

// Your other codes

const getTs = async (req, res) => {
  const form = formidable({ multiples: true });
  let oldPath;
  let newPath;
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Error parsing form:", err);
      res.status(500).send({ error: "Error parsing form" });
      return;
    }

    console.log(files["file"]);

    // console.log(files[0]);
    // Assuming 'file' is the name of the field for the uploaded file
    const uploadedFile = files["file"];

    // Move the file to a permanent location on the server
    oldPath = uploadedFile.filepath;
    newPath = path.join(
      __dirname,
      "uploads",
      uploadedFile.originalFilename || "File"
    );

    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error("Error moving file:", err);
        res.status(500).send({ error: "Error moving file" });
        return;
      }

      // Respond with success message and the file path
      res.send({ success: true, filePath: newPath });
    });
  });

  const pythonProcess = spawnSync("python", [
    "../condense/video_audio_to_data.py",
    "-a",
    oldPath,
  ]);
  const dataToSend = await pythonProcess.stdout.toString();
  if (dataToSend) {
    res.status(200).json({
      transcript: dataToSend,
    });
  } else {
    res.status(400).send({ message: "Error in getting transcript" });
  }
};

const getTranscript = async (req, res) => {
  // console.log(req.body);
  try {
    const { url } = req.body;
    // console.log(url + 'transcript');
    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    const pythonProcess = spawnSync("python", [
      "../condense/transcript.py",
      "--url",
      url,
      "-t",
    ]);

    const dataToSend = await pythonProcess.stdout.toString();
    if (dataToSend) {
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
