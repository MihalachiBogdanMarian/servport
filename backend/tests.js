import colors from "colors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Request from "./models/Request.js";
import Service from "./models/Service.js";
import User from "./models/User.js";

dotenv.config();

connectDB();

mongoose;
colors;
Request;
Service;
User;

// REMOVE USER
// const user = await User.findById("606f6f17942e3d17dc505ac7");
// await user.remove();

// CHANGE REVIEWS OF A SERVICE USING UPDATEONE
// const service = await Service.findById("606f6f17942e3d17dc505bfa").populate("reviews");
// await service.updateOne({
//     reviews: [{ title: "A", comment: "a", rating: 5, user: "606f6f17942e3d17dc505ac9" }, ...service.reviews],
// });

// CHANGE REVIEWS OF A SERVICE USING SAVE
// const service = await Service.findById("606f6f17942e3d17dc505bfa").populate("reviews");
// service.reviews.unshift({ title: "A", comment: "a", rating: 5, user: "606f6f17942e3d17dc505ac5" });
// await service.save();