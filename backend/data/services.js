import colors from "colors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Service from "../models/Service.js";
import User from "../models/User.js";
import getAvailabilityPeriods from "../utils/getAvailabilityPeriods.js";
import { formatDate, randomSubarray } from "../utils/utilities.js";
import reviewsData from "./reviews.json";
import { serviceAddresses, serviceDescriptions } from "./servicesScraped.js";

connectDB();

mongoose;
Service;
User;
colors;
formatDate;
const users = await User.find({});
serviceDescriptions;
serviceAddresses;
reviewsData;

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
//         { startTime: new Date("2021-04-10T08:00:00"), endTime: new Date("2021-04-10T09:00:00") },
//         { startTime: new Date("2021-04-11T16:30:00"), endTime: new Date("2021-04-11T17:30:00") },
//     ],
//     addresses: ["Baltatesti, Neamt", "Valea Seaca, Neamt"],
//     reviews: [{
//         title: "Best service for repairing doors",
//         comment: "Punctual and Serious",
//         rating: 5,
//         user: mongoose.Types.ObjectId("606c5e18011ebb2fa8df4f85"),
//     }, ],
// });
// await service.save();

const MAX_NUM_SERVICES_PER_CATEGORY = 900;

const NUM_REPAIRS_SERVICES = 1;
const NUM_BUILDERS_INSTALLATIONS_SERVICES = 1;
const NUM_BUILDERS_CONSTRUCTIONS_SERVICES = 1;
const NUM_BUILDERS_ROOFS_SERVICES = 1;
const NUM_BUILDERS_INTERIOR_SERVICES = 1;
const NUM_AUTO_AUTO_SERVICES = 1;
const NUM_AUTO_TRANSPORT_SERVICES = 1;
const NUM_EVENTS_PHOTO_SERVICES = 1;
const NUM_EVENTS_DECORATIONS_SERVICES = 1;
const NUM_LESSONS_SERVICES = 4;
const NUM_CLEANING_SERVICES = 5;

const MIN_NUM_REVIEWS_PER_SERVICE = 3;
const MAX_NUM_REVIEWS_PER_SERVICE = 5;

// const NUM_REPAIRS_SERVICES = 450;
// const NUM_BUILDERS_INSTALLATIONS_SERVICES = 450;
// const NUM_BUILDERS_CONSTRUCTIONS_SERVICES = 450;
// const NUM_BUILDERS_ROOFS_SERVICES = 450;
// const NUM_BUILDERS_INTERIOR_SERVICES = 450;
// const NUM_AUTO_AUTO_SERVICES = 450;
// const NUM_AUTO_TRANSPORT_SERVICES = 450;
// const NUM_EVENTS_PHOTO_SERVICES = 450;
// const NUM_EVENTS_DECORATIONS_SERVICES = 450;
// const NUM_LESSONS_SERVICES = 450;
// const NUM_CLEANING_SERVICES = 450;

// const MIN_NUM_REVIEWS_PER_SERVICE = 3;
// const MAX_NUM_REVIEWS_PER_SERVICE = 100;

const NUM_VIEWS_MIN_THRESHOLD = 200;
const NUM_VIEWS_MAX_THRESHOLD = 500;

const REPAIRS_CATEGORY = "Services>Repairs: PC, Electronics, Home Appliances";
const BUILDERS_INSTALLATIONS_CATEGORY = "Services>Craftsmen & Builders>Sanitary, Thermal, AC Installations";
const BUILDERS_CONSTRUCTIONS_CATEGORY = "Services>Craftsmen & Builders>Constructions";
const BUILDERS_ROOFS_CATEGORY = "Services>Craftsmen & Builders>Roofs";
const BUILDERS_INTERIOR_CATEGORY = "Services>Craftsmen & Builders>Interior Design";
const AUTO_AUTO_CATEGORY = "Services>Auto & Transportation>Car Services";
const AUTO_TRANSPORT_CATEGORY = "Services>Auto & Transportation>Transport Services";
const EVENTS_PHOTO_CATEGORY = "Services>Events>Photo & Video";
const EVENTS_DECORATIONS_CATEGORY = "Services>Events>Floral Arrangements & Decorations";
const LESSONS_CATEGORY = "Services>Private Lessons";
const CLEANING_CATEGORY = "Services>Cleaning";

const REPAIRS_MIN_PRICE_L = 50;
const REPAIRS_MIN_PRICE_R = 500;
const REPAIRS_MAX_PRICE_L = 100;
const REPAIRS_MAX_PRICE_R = 500;

const BUILDERS_INSTALLATIONS_MIN_PRICE_L = 250;
const BUILDERS_INSTALLATIONS_MIN_PRICE_R = 1500;
const BUILDERS_INSTALLATIONS_MAX_PRICE_L = 250;
const BUILDERS_INSTALLATIONS_MAX_PRICE_R = 1000;

const BUILDERS_CONSTRUCTIONS_MIN_PRICE_L = 1000;
const BUILDERS_CONSTRUCTIONS_MIN_PRICE_R = 5000;
const BUILDERS_CONSTRUCTIONS_MAX_PRICE_L = 1000;
const BUILDERS_CONSTRUCTIONS_MAX_PRICE_R = 5000;

const BUILDERS_ROOFS_MIN_PRICE_L = 250;
const BUILDERS_ROOFS_MIN_PRICE_R = 1500;
const BUILDERS_ROOFS_MAX_PRICE_L = 250;
const BUILDERS_ROOFS_MAX_PRICE_R = 1000;

const BUILDERS_INTERIOR_MIN_PRICE_L = 250;
const BUILDERS_INTERIOR_MIN_PRICE_R = 1500;
const BUILDERS_INTERIOR_MAX_PRICE_L = 250;
const BUILDERS_INTERIOR_MAX_PRICE_R = 1000;

const AUTO_AUTO_MIN_PRICE_L = 250;
const AUTO_AUTO_MIN_PRICE_R = 1500;
const AUTO_AUTO_MAX_PRICE_L = 250;
const AUTO_AUTO_MAX_PRICE_R = 1000;

const AUTO_TRANSPORT_MIN_PRICE_L = 50;
const AUTO_TRANSPORT_MIN_PRICE_R = 500;
const AUTO_TRANSPORT_MAX_PRICE_L = 100;
const AUTO_TRANSPORT_MAX_PRICE_R = 500;

const EVENTS_PHOTO_MIN_PRICE_L = 50;
const EVENTS_PHOTO_MIN_PRICE_R = 500;
const EVENTS_PHOTO_MAX_PRICE_L = 100;
const EVENTS_PHOTO_MAX_PRICE_R = 500;

const EVENTS_DECORATIONS_MIN_PRICE_L = 50;
const EVENTS_DECORATIONS_MIN_PRICE_R = 500;
const EVENTS_DECORATIONS_MAX_PRICE_L = 100;
const EVENTS_DECORATIONS_MAX_PRICE_R = 500;

const LESSONS_MIN_PRICE_L = 25;
const LESSONS_MIN_PRICE_R = 100;
const LESSONS_MAX_PRICE_L = 25;
const LESSONS_MAX_PRICE_R = 50;

const CLEANING_MIN_PRICE_L = 25;
const CLEANING_MIN_PRICE_R = 100;
const CLEANING_MAX_PRICE_L = 50;
const CLEANING_MAX_PRICE_R = 200;

let services = [];
let serviceAddressesIndex = 0;

const populateServices = (numServices, serviceCategory) => {
    let index = 0;
    for (let i = 0; i < numServices; i++) {
        let user = null;
        let title = "";
        let description = "";
        let category = serviceCategory;
        let minPrice = 0.0;
        let maxPrice = 0.0;
        let price = { minPrice, maxPrice };
        let images = [];
        let availabilityPeriods = [];
        let addresses = [];
        let reviews = [];
        let rating = 0.0;
        let numReviews = 0;
        let numViews = 0;
        let numInterested = 0;
        let paymentCanProceedUsers = [];

        // USER
        user = users[(Math.random() * users.length) | 0]._id;

        // TITLE
        index = Math.floor(Math.random() * MAX_NUM_SERVICES_PER_CATEGORY);
        title =
            serviceDescriptions.filter((serviceAttributes) => serviceAttributes.category === serviceCategory)[index].title ||
            "Service";

        // DESCRIPTION
        index = Math.floor(Math.random() * MAX_NUM_SERVICES_PER_CATEGORY);
        description =
            serviceDescriptions.filter((serviceAttributes) => serviceAttributes.category === serviceCategory)[index]
            .description || "-";

        // PRICE
        switch (serviceCategory) {
            case "Services>Repairs: PC, Electronics, Home Appliances":
                (minPrice = Math.floor(Math.random() * (REPAIRS_MIN_PRICE_R - REPAIRS_MIN_PRICE_L + 1)) + REPAIRS_MIN_PRICE_L),
                (maxPrice =
                    minPrice +
                    Math.floor(Math.random() * (REPAIRS_MAX_PRICE_R - REPAIRS_MAX_PRICE_L + 1)) +
                    REPAIRS_MAX_PRICE_L),
                (price = { minPrice, maxPrice });
                break;
            case "Services>Craftsmen & Builders>Sanitary, Thermal, AC Installations":
                (minPrice =
                    Math.floor(Math.random() * (BUILDERS_INSTALLATIONS_MIN_PRICE_R - BUILDERS_INSTALLATIONS_MIN_PRICE_L + 1)) +
                    BUILDERS_INSTALLATIONS_MIN_PRICE_L),
                (maxPrice =
                    minPrice +
                    Math.floor(Math.random() * (BUILDERS_INSTALLATIONS_MAX_PRICE_R - BUILDERS_INSTALLATIONS_MAX_PRICE_L + 1)) +
                    BUILDERS_INSTALLATIONS_MAX_PRICE_L),
                (price = { minPrice, maxPrice });
                break;
            case "Services>Craftsmen & Builders>Constructions":
                (minPrice =
                    Math.floor(Math.random() * (BUILDERS_CONSTRUCTIONS_MIN_PRICE_R - BUILDERS_CONSTRUCTIONS_MIN_PRICE_L + 1)) +
                    BUILDERS_CONSTRUCTIONS_MIN_PRICE_L),
                (maxPrice =
                    minPrice +
                    Math.floor(Math.random() * (BUILDERS_CONSTRUCTIONS_MAX_PRICE_R - BUILDERS_CONSTRUCTIONS_MAX_PRICE_L + 1)) +
                    BUILDERS_CONSTRUCTIONS_MAX_PRICE_L),
                (price = { minPrice, maxPrice });
                break;
            case "Services>Craftsmen & Builders>Roofs":
                (minPrice =
                    Math.floor(Math.random() * (BUILDERS_ROOFS_MIN_PRICE_R - BUILDERS_ROOFS_MIN_PRICE_L + 1)) +
                    BUILDERS_ROOFS_MIN_PRICE_L),
                (maxPrice =
                    minPrice +
                    Math.floor(Math.random() * (BUILDERS_ROOFS_MAX_PRICE_R - BUILDERS_ROOFS_MAX_PRICE_L + 1)) +
                    BUILDERS_ROOFS_MAX_PRICE_L),
                (price = { minPrice, maxPrice });
                break;
            case "Services>Craftsmen & Builders>Interior Design":
                (minPrice =
                    Math.floor(Math.random() * (BUILDERS_INTERIOR_MIN_PRICE_R - BUILDERS_INTERIOR_MIN_PRICE_L + 1)) +
                    BUILDERS_INTERIOR_MIN_PRICE_L),
                (maxPrice =
                    minPrice +
                    Math.floor(Math.random() * (BUILDERS_INTERIOR_MAX_PRICE_R - BUILDERS_INTERIOR_MAX_PRICE_L + 1)) +
                    BUILDERS_INTERIOR_MAX_PRICE_L),
                (price = { minPrice, maxPrice });
                break;
            case "Services>Auto & Transportation>Car Services":
                (minPrice =
                    Math.floor(Math.random() * (AUTO_AUTO_MIN_PRICE_R - AUTO_AUTO_MIN_PRICE_L + 1)) + AUTO_AUTO_MIN_PRICE_L),
                (maxPrice =
                    minPrice +
                    Math.floor(Math.random() * (AUTO_AUTO_MAX_PRICE_R - AUTO_AUTO_MAX_PRICE_L + 1)) +
                    AUTO_AUTO_MAX_PRICE_L),
                (price = { minPrice, maxPrice });
                break;
            case "Services>Auto & Transportation>Transport Services":
                (minPrice =
                    Math.floor(Math.random() * (AUTO_TRANSPORT_MIN_PRICE_R - AUTO_TRANSPORT_MIN_PRICE_L + 1)) +
                    AUTO_TRANSPORT_MIN_PRICE_L),
                (maxPrice =
                    minPrice +
                    Math.floor(Math.random() * (AUTO_TRANSPORT_MAX_PRICE_R - AUTO_TRANSPORT_MAX_PRICE_L + 1)) +
                    AUTO_TRANSPORT_MAX_PRICE_L),
                (price = { minPrice, maxPrice });
                break;
            case "Services>Events>Photo & Video":
                (minPrice =
                    Math.floor(Math.random() * (EVENTS_PHOTO_MIN_PRICE_R - EVENTS_PHOTO_MIN_PRICE_L + 1)) +
                    EVENTS_PHOTO_MIN_PRICE_L),
                (maxPrice =
                    minPrice +
                    Math.floor(Math.random() * (EVENTS_PHOTO_MAX_PRICE_R - EVENTS_PHOTO_MAX_PRICE_L + 1)) +
                    EVENTS_PHOTO_MAX_PRICE_L),
                (price = { minPrice, maxPrice });
                break;
            case "Services>Events>Floral Arrangements & Decorations":
                (minPrice =
                    Math.floor(Math.random() * (EVENTS_DECORATIONS_MIN_PRICE_R - EVENTS_DECORATIONS_MIN_PRICE_L + 1)) +
                    EVENTS_DECORATIONS_MIN_PRICE_L),
                (maxPrice =
                    minPrice +
                    Math.floor(Math.random() * (EVENTS_DECORATIONS_MAX_PRICE_R - EVENTS_DECORATIONS_MAX_PRICE_L + 1)) +
                    EVENTS_DECORATIONS_MAX_PRICE_L),
                (price = { minPrice, maxPrice });
                break;
            case "Services>Private Lessons":
                (minPrice = Math.floor(Math.random() * (LESSONS_MIN_PRICE_R - LESSONS_MIN_PRICE_L + 1)) + LESSONS_MIN_PRICE_L),
                (maxPrice =
                    minPrice +
                    Math.floor(Math.random() * (LESSONS_MAX_PRICE_R - LESSONS_MAX_PRICE_L + 1)) +
                    LESSONS_MAX_PRICE_L),
                (price = { minPrice, maxPrice });
                break;
            case "Services>Cleaning":
                (minPrice =
                    Math.floor(Math.random() * (CLEANING_MIN_PRICE_R - CLEANING_MIN_PRICE_L + 1)) + CLEANING_MIN_PRICE_L),
                (maxPrice =
                    minPrice +
                    Math.floor(Math.random() * (CLEANING_MAX_PRICE_R - CLEANING_MAX_PRICE_L + 1)) +
                    CLEANING_MAX_PRICE_L),
                (price = { minPrice, maxPrice });
                break;
            default:
                price = { minPrice: 0.0, maxPrice: 0.0 };
                break;
        }

        // IMAGES
        switch (serviceCategory) {
            case "Services>Repairs: PC, Electronics, Home Appliances":
                images = [...images, "repairs.jpg"];
                break;
            case "Services>Craftsmen & Builders>Sanitary, Thermal, AC Installations":
                images = [...images, "builders-installations.jpg"];
                break;
            case "Services>Craftsmen & Builders>Constructions":
                images = [...images, "builders-constructions.jpg"];
                break;
            case "Services>Craftsmen & Builders>Roofs":
                images = [...images, "builders-roofs.jpg"];
                break;
            case "Services>Craftsmen & Builders>Interior Design":
                images = [...images, "builders-interior.jpg"];
                break;
            case "Services>Auto & Transportation>Car Services":
                images = [...images, "auto-auto.jpg"];
                break;
            case "Services>Auto & Transportation>Transport Services":
                images = [...images, "auto-transport.jpg"];
                break;
            case "Services>Events>Photo & Video":
                images = [...images, "events-photo.jpg"];
                break;
            case "Services>Events>Floral Arrangements & Decorations":
                images = [...images, "events-decorations.jpg"];
                break;
            case "Services>Private Lessons":
                images = [...images, "lessons.jpg"];
                break;
            case "Services>Cleaning":
                images = [...images, "cleaning.jpg"];
                break;
            default:
                images = [...images];
                break;
        }

        // AVAILABILITY PERIODS
        availabilityPeriods = getAvailabilityPeriods(serviceCategory);

        // ADDRESSES
        addresses = [...addresses, serviceAddresses[serviceAddressesIndex].addresses];
        serviceAddressesIndex++;

        // REVIEWS
        const numReviewsPerService =
            Math.floor(Math.random() * (MAX_NUM_REVIEWS_PER_SERVICE - MIN_NUM_REVIEWS_PER_SERVICE + 1)) +
            MIN_NUM_REVIEWS_PER_SERVICE;
        reviews = randomSubarray(reviewsData, numReviewsPerService);
        const userIdsRandomSubarray = randomSubarray(
            users.map((user) => user._id),
            numReviewsPerService
        );
        reviews = reviews.map((review, index) => ({
            title: review.title || "Review",
            rating: review.rating || 3,
            comment: review.comment || "Empty comment",
            createdAt: review.createdAt,
            user: userIdsRandomSubarray[index],
        }));
        reviews.sort((r1, r2) => new Date(r2.createdAt) - new Date(r1.createdAt));

        // NUM REVIEWS
        numReviews = reviews.length;

        // RATING
        rating = (reviews.reduce((sum, currentVal) => sum + currentVal.rating, 0) / numReviews).toFixed(2);

        // NUM VIEWS
        numViews =
            Math.floor(Math.random() * (NUM_VIEWS_MAX_THRESHOLD - NUM_VIEWS_MIN_THRESHOLD + 1)) +
            NUM_VIEWS_MIN_THRESHOLD +
            numReviews;

        // NUM INTERESTED
        numInterested = Math.floor(Math.random() * (numViews + 1));

        const service = new Service({
            user,
            title,
            description,
            category,
            price,
            images,
            availabilityPeriods,
            addresses,
            reviews,
            rating,
            numReviews,
            numViews,
            numInterested,
            paymentCanProceedUsers,
        });

        services = [...services, service];
    }
};

populateServices(NUM_REPAIRS_SERVICES, REPAIRS_CATEGORY);
populateServices(NUM_BUILDERS_INSTALLATIONS_SERVICES, BUILDERS_INSTALLATIONS_CATEGORY);
populateServices(NUM_BUILDERS_CONSTRUCTIONS_SERVICES, BUILDERS_CONSTRUCTIONS_CATEGORY);
populateServices(NUM_BUILDERS_ROOFS_SERVICES, BUILDERS_ROOFS_CATEGORY);
populateServices(NUM_BUILDERS_INTERIOR_SERVICES, BUILDERS_INTERIOR_CATEGORY);
populateServices(NUM_AUTO_AUTO_SERVICES, AUTO_AUTO_CATEGORY);
populateServices(NUM_AUTO_TRANSPORT_SERVICES, AUTO_TRANSPORT_CATEGORY);
populateServices(NUM_EVENTS_PHOTO_SERVICES, EVENTS_PHOTO_CATEGORY);
populateServices(NUM_EVENTS_DECORATIONS_SERVICES, EVENTS_DECORATIONS_CATEGORY);
populateServices(NUM_LESSONS_SERVICES, LESSONS_CATEGORY);
populateServices(NUM_CLEANING_SERVICES, CLEANING_CATEGORY);

// console.log(services);

// process.exit();

export default services;