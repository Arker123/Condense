const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/authRoute");
const summaryRoute = require("./routes/summaryRoute");
const noteRoute = require("./routes/noteRoute");

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.use("/auth", authRoute);
app.use("/note", noteRoute);
app.use("/summaries", summaryRoute);

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to Database"))
    .then(() => {
        if (process.env.NODE_ENV != "test") {
            app.listen(port, () => {
                console.log(`Server is running on ${port} `);
            });
        }
    });

module.exports = app;
