import express from "express";
import cors from "cors";

import dotenv from 'dotenv'

const app = express();
dotenv.config();

import authRoute from "./routes/authRoute.js";
import mongoose from "mongoose";

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.use("/auth", authRoute);

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('Connected to Database'))
.then(() => {
  
  app.listen(port, () => {
    console.log(`Server is running on ${port} `);
  });
});

export default app;
