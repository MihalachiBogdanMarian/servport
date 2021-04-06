import mongoose from "mongoose";
import geocoder from "../utils/geocoder.js";
import ReviewSchema from "./Review.js";

const AvailabilityPeriodSchema = new mongoose.Schema({
    startTime: {
        type: Date,
        required: [true, "Please add a start time"],
        min: [Date.now, "Please add a starting date in the future"],
    },
    endTime: {
        type: Date,
        required: [true, "Please add an end time"],
    },
});

AvailabilityPeriodSchema.path("endTime").validate(function(value) {
    return this.startTime < value;
}, "Please add an ending date greater than the starting date");

const ServiceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    title: {
        type: String,
        required: [true, "Please add a title"],
        maxlength: [200, "Cannot exceed 200 characters"],
    },
    description: {
        type: String,
        required: [true, "Please add a description"],
        maxlength: [10000, "Cannot exceed 10000 characters"],
    },
    category: {
        type: String,
        required: [true, "Please add a category"],
        maxlength: [100, "Cannot exceed 100 characters"],
        enum: [
            "Services>Repairs: PC, Electronics, Home Appliances",
            "Services>Craftsmen&Builders>Sanitary, Thermal, AC Installations",
            "Services>Craftsmen&Builders>Constructions",
            "Services>Craftsmen&Builders>Roofs",
            "Services>Craftsmen&Builders>Interior Design",
            "Services>Auto&Transportation>Car Services",
            "Services>Auto&Transportation>Transport Services",
            "Services>Events>Photo&Video",
            "Services>Events>Floral Arrangements&Decorations",
            "Services>Meditations",
            "Services>Cleaning",
        ], // the only values it can have
    },
    price: {
        minPrice: {
            type: Number,
            required: [true, "Please add a min price"],
            default: 0,
        },
        maxPrice: {
            type: Number,
            required: [true, "Please add a max price"],
            default: 0,
        },
    },
    images: {
        type: [String],
        default: ["no-image.jpg"],
    },
    availabilityPeriods: {
        type: [AvailabilityPeriodSchema],
        required: [true, "Please add at least one availability period when you will provide the service"],
        validate: {
            validator: (array) =>
                new Promise(function(resolve, reject) {
                    resolve(array.length > 0);
                }),
            message: "You need to add at least one availability period when the service will be provided",
        },
    },
    addresses: {
        type: [String],
        required: [true, "Please add at least one location where you will provide the service"],
        validate: {
            validator: (array) =>
                new Promise(function(resolve, reject) {
                    resolve(array.length > 0);
                }),
            message: "You need to add at least one location where the service will be provided",
        },
    },
    locations: [{
        type: {
            type: String,
            enum: ["Point"],
        },
        coordinates: {
            type: [Number],
            index: "2dsphere",
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
    }, ],
    reviews: [ReviewSchema],
    rating: {
        type: Number,
        required: true,
        default: 0,
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0,
    },
    numViews: {
        type: Number,
        required: true,
        default: 0,
    },
    numInterested: {
        type: Number,
        required: true,
        default: 0,
    },
    paymentCanProceedUsers: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        }, ],
    },
}, {
    timestamps: true,
});

// set service owner as the default user who can proceed to payment
ServiceSchema.pre("save", async function(next) {
    this.paymentCanProceedUsers = [...this.paymentCanProceedUsers, this.user];

    next();
});

// geocode & create locations field
ServiceSchema.pre("save", async function(next) {
    const getLocations = () => {
        const promises = this.addresses.map(async(address) => {
            const location = await geocoder.geocode(address);
            return {
                type: "Point",
                coordinates: [location[0].longitude, location[0].latitude],
                formattedAddress: location[0].formattedAddress,
                street: location[0].streetName,
                city: location[0].city,
                state: location[0].stateCode,
                zipcode: location[0].zipcode,
                country: location[0].countryCode,
            };
        });
        return Promise.all(promises);
    };

    const locations = await getLocations();
    this.locations = locations;

    this.addresses = undefined;

    next();
});

const AvailabilityPeriod = mongoose.model("AvailabilityPeriod", AvailabilityPeriodSchema);
const Service = mongoose.model("Service", ServiceSchema);

export default Service;
export { AvailabilityPeriodSchema, AvailabilityPeriod };