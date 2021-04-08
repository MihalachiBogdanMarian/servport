import colors from "colors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Request from "../models/Request.js";

mongoose;
Request;
colors;

dotenv.config();

// connect to the database
// connectDB();

// console.log("Populating REQUESTS Collection...");

// const request = new Request({
//     user: mongoose.Types.ObjectId("606c5e18011ebb2fa8df4f85"),
//     requestServices: [{
//         title: "Test Service",
//         availabilityPeriod: {
//             startTime: new Date("2021-04-10T16:30:00"),
//             endTime: new Date("2021-04-10T17:30:00"),
//         },
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