const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

const getApiKey = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API key not found in environment variables");
    }
    return apiKey;
};

app.post("/predict_sentiment", async (req, res) => {
    const comment = req.body.comment;
    try {
        const apiKey = getApiKey();
        const response = await axios.post(
            "https://condense-4eevndrdnq-em.a.run.app/analyze_sentiment",
            { apiKey, comment },
        );
        const prediction = response.data.prediction;
        res.json({ prediction });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
