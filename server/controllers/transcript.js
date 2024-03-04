// import {spawn} from 'child_process'
const { spawnSync } = require("child_process");

const getTranscript = async (req, res) => {
  const { url } = req.body;


  const pythonProcess = spawnSync("python", [
    "../condense/transcript.py",
    "--url",
    url,
    "-t",
  ]);

  const dataToSend = await pythonProcess.stdout.toString();
  if (dataToSend) {
    res.send(dataToSend);
    res.status(200).end();
  } else {
    res.status(400).send("Error in getting transcript");
  }
};

module.exports = { getTranscript };
