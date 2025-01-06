import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import userRouter from "./routes/user-route";
import AppError from "../utils/app-error";
import { globalErrorHandler } from "./controllers/error-controller";

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
app.use("/api/v1/users", userRouter);
app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
