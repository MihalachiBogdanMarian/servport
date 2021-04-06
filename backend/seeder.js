import colors from "colors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import requests from "./data/requests.js";
import services from "./data/services.js";
import users from "./data/users.js";
import Request from "./models/Request.js";
import Service from "./models/Service.js";
import User from "./models/User.js";

dotenv.config();

connectDB();

mongoose;
colors;

const importData = async() => {
    try {
        await User.deleteMany();
        await Service.deleteMany();
        await Request.deleteMany();

        await User.create(users);
        await Service.create(services);
        await Request.create(requests);

        console.log("Data Imported!".green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

const destroyData = async() => {
    try {
        await User.deleteMany();
        await Service.deleteMany();
        await Request.deleteMany();

        console.log("Data Destroyed!".red.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

if (process.argv[2] === "-d") {
    destroyData();
} else {
    importData();
}