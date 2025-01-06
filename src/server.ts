import app from "./index";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const db = (process.env.DATABASE ?? "").replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD ?? ""
);
mongoose.connect(db).then(() => {
    console.log("DB connection successful");
});

// START SERVER
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
