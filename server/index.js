import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const port = PROCESS.env.PORT || 5000;

app.use('/auth',authRoute);




app.listen(port, () => {
  console.log(`Server is running on ${port} `);
});


