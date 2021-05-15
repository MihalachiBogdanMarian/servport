// NODEJS MODULES
import colors from "colors";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fileupload from "express-fileupload";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import path from "path";
import xss from "xss-clean";
// DB
import connectDB from "./config/db.js";
// express error handling middleware
import { errorHandler, notFound } from "./middleware/error.js";
// ROUTE FILES
import auth from "./routes/auth.js";
import requests from "./routes/requests.js";
import reviews from "./routes/reviews.js";
import services from "./routes/services.js";
import users from "./routes/users.js";

// load environment variables
dotenv.config();
const PORT = process.env.PORT || 5000;

colors;
errorHandler;

/*





*/

// connect to the database
connectDB();

// create express app
const app = express();

/*





*/

// MIDDLEWARE

// for accepting json in the request body
app.use(express.json());

// cookie parser
app.use(cookieParser());

// dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// file uploading
app.use(fileupload());

// sanitize data
app.use(mongoSanitize());

// set security headers
app.use(helmet());

// prevent XSS attacks
app.use(xss());

// rate (nr of requests) limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // minutes
    max: 100,
});
app.use(limiter);

// prevent HTTP parameters pollution
app.use(hpp());

// enable CORS
app.use(cors());

/*





*/

// make uploads folder static
const __dirname = path.resolve(); // available directly if using require syntax instead of import
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// mount routers
app.use("/api/v1/users", users);
app.use("/api/v1/auth", auth);
app.use("/api/v1/services", services);
app.use("/api/v1/services/:serviceId/reviews", reviews);
app.use("/api/v1/requests", requests);

// express error handling middleware
app.use(errorHandler);

if (process.env.NODE_ENV === "production") {
    // PRODUCTION
    app.use(express.static(path.join(__dirname, "/frontend/build")));

    app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html")));
} else {
    // DEVELOPMENT
    app.get("/", (req, res) => {
        res.send("API is running...");
    });
}

// if the routes above weren't hit
app.use(notFound);

/*





*/

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