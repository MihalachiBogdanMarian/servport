// NODEJS MODULES
import colors from "colors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
// DB
import connectDB from "./config/db.js";

// load environment variables
dotenv.config();
const PORT = process.env.PORT || 5000;

colors;

// connect to the database
connectDB();

const app = express();

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// for accepting json in the request body
app.use(express.json());

// run the app/server
const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

// handle unhandled promise rejections
process.on("unhandledRejection", (error, promise) => {
    console.log(`Error: ${error.message}`.red);
    // close server and exit process
    server.close(() => process.exit(1));
});