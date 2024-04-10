const Summary = require("../models/summaryModel");
const User = require("../models/UserModel");
const redisClient = require("../redis.js");

const { spawnSync } = require("child_process");

const generateSummary = async (req, res) => {
    try {
        const { videoId } = req.body;
        if (!videoId) return res.status(400).send("URL is required");
        const url = "https://www.youtube.com/watch?v=" + videoId;
        console.log(url);
        const summary = await redisClient.get(videoId);

        if (summary) {
            console.log("Cache hit");
            return res.status(200).json({
                summary: JSON.parse(summary),
                message: "Summary generated successfully",
            });
        }

        console.log("Cache miss, generating summary...");
        const pythonProcess = spawnSync("python", [
            "../condense/summarizer.py",
            "--url",
            url,
        ]);

        const dataToSend = await pythonProcess.stdout.toString();
        await redisClient.set(videoId, JSON.stringify(dataToSend));
        res.status(200).json({
            summary: dataToSend,
            message: "Summary generated successfully",
        });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const fetchAllSummaries = async (req, res) => {
    try {
        console.log("in fetcallsumm backend");
        console.log("req.body: ", req.body);
        const { userId } = req.body.data;
        console.log("userid from api: ", userId);
        if (!userId) return res.status(400).send("User ID is required");

        // Find user with the given user ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).send("User not found");
        }

        // Extract summary IDs from the user document
        const summaryIds = user.summaries.map((summary) => summary.summaryId);

        // Fetch summaries from the Summary schema based on the summary IDs
        const summaries = await Summary.find({ _id: { $in: summaryIds } });

        console.log("Found the following summaries:");
        return res.status(200).json(summaries);
    } catch (error) {
        console.log("in err block");
        console.error("Error occurred while fetching summaries", error);
        return res.status(400).send(error.message);
    }
};

const fetchOneSummary = async (req, res) => {
    try {
        const { userId, summaryId } = req.body;
        if (!userId) return res.status(400).send("User ID is required");
        if (!summaryId) return res.status(400).send("Summary ID is required");

        // Find user with the given user ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).send("User not found");
        }

        // Extract summary IDs from the user document
        // matching the specific summary ID
        const summaryIds = user.summaries
            .filter((summary) => summary.summaryId === summaryId)
            .map((summary) => summary.summaryId);

        // Fetch summaries from the Summary schema based on the summary IDs
        const summaries = await Summary.find({ _id: { $in: summaryIds } });

        console.log("Found the following summaries:");
        console.log(summaries);
        return res.status(200).json(summaries);
    } catch (error) {
        console.error("Error occurred while fetching summaries", error);
        return res.status(400).send(error.message);
    }
};

const fetchFavSummaries = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).send("User ID is required");

        // Find user with the given user ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).send("User not found");
        }

        // Extract summary IDs from the user document where favorite is true
        const summaryIds = user.summaries
            .filter((summary) => summary.favorite === true)
            .map((summary) => summary.summaryId);

        // Fetch summaries from the Summary schema based on the summary IDs
        const summaries = await Summary.find({ _id: { $in: summaryIds } });

        console.log("Found the following summaries:");
        console.log(summaries);
        return res.status(200).json(summaries);
    } catch (error) {
        console.error("Error occurred while fetching summaries", error);
        return res.status(400).send(error.message);
    }
};

const modifyFavSummaries = async (req, res) => {
    try {
        const { userId, summaryId } = req.body;
        if (!userId) return res.status(400).send("User ID is required");
        if (!summaryId) return res.status(400).send("Summary ID is required");

        // Find the user with the given user ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).send("User not found");
        }

        // Find the index of the summary with the given summary ID
        const summaryIndex = user.summaries.findIndex(
            (summary) => summary.summaryId === summaryId,
        );

        if (summaryIndex === -1) {
            return res.status(400).send("Summary not found");
        }

        const currentFavVal = user.summaries[summaryIndex].favorite;

        // Toggle the value of favorite for that summary
        user.summaries[summaryIndex].favorite = !currentFavVal;

        // Save the updated user document
        await user.save();

        console.log(`Favorite attribute for summary ID ${summaryId} 
    modified to ${!currentFavVal}`);

        return res.status(200).json({ message: "Successfully modified" });
    } catch (error) {
        console.error(
            "Error occurred while modifying favorite attribute",
            error,
        );
        return res.status(400).send(error.message);
    }
};

const saveSummary = async (req, res) => {
    try {
        const { userId, videoId, summaryBody } = req.body;
        console.log(userId);
        if (!userId) return res.status(400).send("User ID is required");
        if (!videoId) return res.status(400).send("Video ID is required");

        // Find the user with the given user ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).send("User not found");
        }

        // Create a new summary document
        const NewSummary = new Summary({
            videoId: videoId,
            summary: {
                body: summaryBody,
            },
        });

        // Save the new summary document
        const savedSummary = await NewSummary.save();

        // Create a new summary object with the saved summary's ID
        const newSummaryObject = {
            summaryId: savedSummary._id, // Use the ID generated by MongoDB
            favorite: false, // Default value for favorite
        };

        // Push the new summary object to the user's summaries array
        user.summaries.push(newSummaryObject);

        // Save the updated user document
        await user.save();

        console.log("Summary stored successfully");

        return res.status(200).send("Summary saved.");
    } catch (error) {
        console.error("Error occurred while storing summary", error);
        return res.status(400).send(error.message);
    }
};

module.exports = {
    fetchAllSummaries,
    fetchOneSummary,
    fetchFavSummaries,
    modifyFavSummaries,
    saveSummary,
    generateSummary,
};
