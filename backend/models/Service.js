import mongoose from "mongoose";
import geocoder from "../utils/geocoder.js";
import AvailabilityPeriodSchema from "./AvailabilityPeriod.js";
import ReviewSchema from "./Review.js";
import User from "./User.js";

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
            "Services>Private Lessons",
            "Services>Cleaning",
        ], // the only values it can have
    },
    price: {
        minPrice: {
            type: Number,
            required: [true, "Please add a min price"],
            default: 0.0,
        },
        maxPrice: {
            type: Number,
            required: [true, "Please add a max price"],
            default: 0.0,
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
    previousRating: {
        type: Number,
        default: 0.0,
    },
    rating: {
        type: Number,
        required: true,
        default: 0.0,
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
        default: [],
    },
}, {
    timestamps: true,
});

ServiceSchema.path("reviews").validate(function(value) {
    const userIds = value.map((review) => review.user.toString());
    return new Set(userIds).size === userIds.length;
}, "A user cannot leave more than one review");

// set service owner as the default user who can proceed to payment
ServiceSchema.pre("save", function(next) {
    if (!this.isModified("paymentCanProceedUsers")) {
        next();
    } else {
        if (!this.paymentCanProceedUsers.includes(this.user)) {
            this.paymentCanProceedUsers = [...this.paymentCanProceedUsers, this.user];
            next();
        } else {
            next();
        }
    }
});

// geocode & create locations field
ServiceSchema.pre("save", async function(next) {
    if (!this.isModified("addresses")) {
        next();
    } else {
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

        // this.addresses = undefined;

        next();
    }
});

// recompute the number of reviews and the main rating when the array of reviews is changing
ServiceSchema.pre("save", function(next) {
    if (!this.isModified("reviews")) {
        next();
    } else {
        this.numReviews = this.reviews.length;
        this.previousRating = this.rating;
        this.rating = (this.reviews.reduce((sum, currentVal) => sum + currentVal.rating, 0) / this.reviews.length).toFixed(
            2
        );

        next();
    }
});

// recompute the trust score for the user possessing this service when the rating is changing
ServiceSchema.post("save", async function(doc, next) {
    if (this.previousRating === doc.rating) {
        next();
    } else {
        const user = await User.findById(doc.user);

        const userServices = await Service.find({ user: doc.user });

        user.trustScore = (
            userServices.reduce((sum, currentVal) => sum + currentVal.rating, 0) / userServices.length
        ).toFixed(2);
        user.save();

        next();
    }
});

const Service = mongoose.model("Service", ServiceSchema);

export default Service;