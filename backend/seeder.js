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
users;
services;
requests;
colors;

const importData = async() => {
    try {
        // first run the User population, then the Service + Request population

        // await User.deleteMany();
        // console.log("Users Destroyed!".red.inverse);
        // await Service.deleteMany();
        // console.log("Services Destroyed!".red.inverse);
        // await Request.deleteMany();
        // console.log("Requests Destroyed!".red.inverse);

        console.log("Data Destroyed!".red.inverse);

        // await User.create(users);
        // console.log("Users Imported!".green.inverse);
        await Service.create(services);
        console.log("Services Imported!".green.inverse);
        await Request.create(requests);
        console.log("Requests Imported!".green.inverse);

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
        console.log("Users Destroyed!".red.inverse);
        await Service.create(services);
        console.log("Services Imported!".green.inverse);
        await Request.create(requests);
        console.log("Requests Imported!".green.inverse);

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