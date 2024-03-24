const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.post('/predict_sentiment', async (req, res) => {
    const comment = req.body.comment;
    try {
        const response = await axios.post('http://python-api-server:5000/predictSentiment', { comment });
        const prediction = response.data.prediction;
        res.json({ prediction });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
