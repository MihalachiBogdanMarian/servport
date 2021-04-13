import colors from "colors";
import dotenv from "dotenv";
import User from "../models/User.js";
import { firstNamesBoys, firstNamesGirls, lastNames } from "./names.js";
import { serviceAddresses } from "./servicesScraped.js";

User;
colors;
firstNamesBoys;
firstNamesGirls;
lastNames;
serviceAddresses;

dotenv.config();

// connect to the database
// connectDB();

// console.log("Populating USERS collection...");

// const user = new User({
//     name: "Bogdan Mihalachi",
//     email: "bogdan@learn.com",
//     phone: "0727855271",
//     password: "123456",
//     isAdmin: true,
//     address: "Valea Seaca, Neamt",
// });
// await user.save();

// const NUM_USERS = 4;
// const NUM_ADMINS = 1;

const NUM_USERS = 497;
const NUM_ADMINS = 3;

let users = [];

const populateUsers = (numUsers, areAdmins) => {
    Array.from(Array(numUsers).keys()).forEach((i) => {
        let name = "";
        let email = "";
        let phone = "07";
        let password = "";
        let isAdmin = areAdmins;
        let address = "";

        // NAME
        const boyOrGirl = Math.floor(Math.random() * 2 + 1);
        const numFirstNames = Math.floor(Math.random() * 2 + 1);
        const firstName =
            boyOrGirl === 1 ?
            numFirstNames === 1 ?
            firstNamesBoys[(Math.random() * firstNamesBoys.length) | 0] :
            firstNamesBoys[(Math.random() * firstNamesBoys.length) | 0] +
            "-" +
            firstNamesBoys[(Math.random() * firstNamesBoys.length) | 0] :
            numFirstNames === 1 ?
            firstNamesGirls[(Math.random() * firstNamesGirls.length) | 0] :
            firstNamesGirls[(Math.random() * firstNamesGirls.length) | 0] +
            "-" +
            firstNamesGirls[(Math.random() * firstNamesGirls.length) | 0];
        const lastName = lastNames[(Math.random() * lastNames.length) | 0];
        name = firstName + " " + lastName;

        // EMAIL
        email =
            (firstName.includes("-") ? firstName.split("-")[0].toLowerCase() : firstName.toLowerCase()) +
            Math.floor(Math.random() * 9000 + 1000) +
            (areAdmins ? ".admin" : "") +
            "@servport.com";

        // PHONE
        phone += Math.floor(Math.random() * 9);
        Array.from(Array(7).keys()).forEach((i) => (phone += Math.floor(Math.random() * 10)));

        // PASSWORD
        Array.from(Array(6).keys()).forEach((i) => (password += Math.floor(Math.random() * 10)));

        // ADDRESS
        address = serviceAddresses[(Math.random() * serviceAddresses.length) | 0].addresses;

        const user = new User({ name, email, phone, password, isAdmin, address });

        users = [...users, user];
    });
};

populateUsers(NUM_USERS, false);
populateUsers(NUM_ADMINS, true);

// console.log(users);

// process.exit();

export default users;