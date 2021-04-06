import colors from "colors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Request from "../models/Request.js";
import { AvailabilityPeriod } from "../models/Service.js";

AvailabilityPeriod;
Request;
colors;
mongoose;

dotenv.config();

// connect to the database
// connectDB();

// console.log("Populating REQUESTS Collection...");

// const request = new Request({
//     user: mongoose.Types.ObjectId("606c5e18011ebb2fa8df4f85"),
//     requestServices: [{
//         title: "Test Service",
//         availabilityPeriod: new AvailabilityPeriod({
//             startTime: new Date("2021-04-08T16:30:00"),
//             endTime: new Date("2021-04-08T17:30:00"),
//         }),
//         image: "no-image.jpg",
//         price: 500,
//         executionAddress: {
//             address: "Exact address",
//         },
//         service: mongoose.Types.ObjectId("606c892335f0762f5cdece3c"),
//     }, ],
//     paymentMethod: "PayPal",
// });
// await request.save();

const requests = [];

// process.exit();

export default requests;