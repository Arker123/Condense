// import {spawn} from 'child_process'
const { spawnSync } = require("child_process");

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
        console.log("url in transcript : ", url )
        const stderr = await pythonProcess.stderr.toString()
        console.log(stderr)
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

module.exports = { getTranscript };
