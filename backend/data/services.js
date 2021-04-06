import colors from "colors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Review } from "../models/Review.js";
import Service, { AvailabilityPeriod } from "../models/Service.js";

AvailabilityPeriod;
Review;
Service;
colors;
mongoose;

dotenv.config();

// connect to the database
// connectDB();

// console.log("Populating SERVICES collection...");

// const service = new Service({
//     user: mongoose.Types.ObjectId("606c5e18011ebb2fa8df4f85"),
//     title: "Test Service",
//     description: "I repair doors with exquisite attention",
//     category: "Services>Repairs: PC, Electronics, Home Appliances",
//     price: {
//         minPrice: 250,
//         maxPrice: 750,
//     },
//     availabilityPeriods: [
//         new AvailabilityPeriod({ startTime: new Date("2021-04-07T08:00:00"), endTime: new Date("2021-04-07T09:00:00") }),
//         new AvailabilityPeriod({ startTime: new Date("2021-04-08T16:30:00"), endTime: new Date("2021-04-08T17:30:00") }),
//     ],
//     addresses: ["Baltatesti, Neamt", "Valea Seaca, Neamt"],
//     reviews: [
//         new Review({
//             title: "Best service for repairing doors",
//             comment: "Punctual and Serious",
//             rating: 5,
//             user: mongoose.Types.ObjectId("606c5e18011ebb2fa8df4f85"),
//         }),
//     ],
// });
// await service.save();

const services = [];

// process.exit();

export default services;