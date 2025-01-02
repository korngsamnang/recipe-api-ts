import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// CONFIGURATION
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin",
    })
);
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ROUTES
app.get("/", (req, res) => {
    res.send("Hello World!!!!");
});

// SERVER
const port = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${port}`);
});
