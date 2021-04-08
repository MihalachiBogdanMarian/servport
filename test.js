import colors from "colors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./backend/config/db.js";
import reviewsData from "./backend/data/reviews.js";
import { serviceAddresses, serviceDescriptions } from "./backend/data/servicesScraped.js";
import { Review } from "./backend/models/Review.js";
import Service, { AvailabilityPeriod } from "./backend/models/Service.js";
import User from "./backend/models/User.js";

connectDB();

mongoose;
AvailabilityPeriod;
Review;
Service;
User;
colors;
serviceDescriptions;
serviceAddresses;
reviewsData;

dotenv.config();

connectDB();

console.log("Populating SERVICES collection...");

const service = new Service({
    user: mongoose.Types.ObjectId("606c5e18011ebb2fa8df4f85"),
    title: "Test Service",
    description: "I repair doors with exquisite attention",
    category: "Services>Repairs: PC, Electronics, Home Appliances",
    price: {
        minPrice: 250,
        maxPrice: 750,
    },
    availabilityPeriods: [
        new AvailabilityPeriod({ startTime: new Date("2021-04-10T08:00:00"), endTime: new Date("2021-04-10T09:00:00") }),
        new AvailabilityPeriod({ startTime: new Date("2021-04-11T16:30:00"), endTime: new Date("2021-04-11T17:30:00") }),
    ],
    addresses: ["Baltatesti, Neamt", "Valea Seaca, Neamt"],
    reviews: [{
        title: "Best service for repairing doors",
        comment: "Punctual and Serious",
        rating: 5,
        user: mongoose.Types.ObjectId("606eac1e6802b71a0ccc230f"),
    }, ],
});
await service.save();