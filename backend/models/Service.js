import mongoose from "mongoose";
import geocoder from "../utils/geocoder.js";
import knn from "../utils/knn.js";
import AvailabilityPeriodSchema from "./AvailabilityPeriod.js";
import ReviewSchema from "./Review.js";
import User from "./User.js";

geocoder;
knn;

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
            "Services>Craftsmen & Builders>Sanitary, Thermal, AC Installations",
            "Services>Craftsmen & Builders>Constructions",
            "Services>Craftsmen & Builders>Roofs",
            "Services>Craftsmen & Builders>Interior Design",
            "Services>Auto & Transportation>Car Services",
            "Services>Auto & Transportation>Transport Services",
            "Services>Events>Photo & Video",
            "Services>Events>Floral Arrangements & Decorations",
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
            user: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "User",
            },
            price: {
                type: Number,
                required: true,
            },
            hasPaid: {
                type: Boolean,
                required: true,
                default: false,
            },
            addedAt: {
                type: Date,
                required: true,
                default: Date.now(),
            },
            expiresAt: {
                type: Date,
                required: true,
                default: new Date(Date.now()).setDate(new Date(Date.now()).getDate() + 1),
            },
        }, ],
        default: [],
    },
}, {
    timestamps: true,
});

// ServiceSchema.path("reviews").validate(function(value) {
//     const userIds = value.map((review) => review.user._id.toString());
//     return new Set(userIds).size === userIds.length;
// }, "A user cannot leave more than one review");

// set service owner as the default user who can proceed to payment
ServiceSchema.pre("save", function(next) {
    if (!this.isModified("paymentCanProceedUsers")) {
        next();
    } else {
        if (!this.paymentCanProceedUsers.some((userWhoCanProceed) => userWhoCanProceed.user === this.user)) {
            this.paymentCanProceedUsers = [...this.paymentCanProceedUsers, { user: this.user, hasPaid: true, price: 0 }];
            next();
        } else {
            next();
        }
    }
});

// geocode & create locations field (provided more request to the API can be made)
ServiceSchema.pre("save", async function(next) {
    if (!this.isModified("addresses")) {
        next();
    } else {
        try {
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
        } catch (error) {
            console.log(error.message);
        }

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

/* CLUSTERING COMPONENT - CALL KNN IF CLUSTERING RELATED ATTRIBUTES HAVE CHANGED */
// check if any of the services vector numeric fields has changed
// ServiceSchema.pre("save", function(next) {
//     if (!this.isModified("price") &&
//         !this.isModified("rating") &&
//         !this.isModified("numReviews") &&
//         !this.isModified("numViews") &&
//         !this.isModified("numInterested") &&
//         !this.isModified("availabilityPeriods")
//     ) {
//         this.clusteringFieldsModified = false;
//         next();
//     } else {
//         this.clusteringFieldsModified = true;
//         next();
//     }
// });

// reassign the cluster if any of the services vector numeric fields has changed
// ServiceSchema.post("save", async function(doc, next) {
//     if (doc.clusteringFieldsModified) {
//         await knn(doc._id, next);
//         next();
//     } else {
//         next();
//     }
// });

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

ServiceSchema.index({ title: "text", description: "text" }, { name: "ServiceTextIndex", weights: { title: 10, description: 7 } });

const Service = mongoose.model("Service", ServiceSchema);

export default Service;