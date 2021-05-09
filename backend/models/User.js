import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import geocoder from "../utils/geocoder.js";
import AvailabilityPeriodSchema from "./AvailabilityPeriod.js";

geocoder;

const ScheduleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    availabilityPeriod: { type: AvailabilityPeriodSchema, required: true },
    price: { type: Number, required: true },
    executionAddress: {
        type: String,
        required: [true, "Please add the exact address where the service will be provided"],
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Service",
    },
    completed: {
        type: Boolean,
        required: true,
        default: false,
    },
});

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: [true, "This email has already been registered"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please add a valid email"],
    },
    phone: {
        type: String,
        required: [true, "Please add a phone number"],
        unique: [true, "This phone number has already been registered"],
        match: [
            /^(\+4|)?(07[0-8]{1}[0-9]{1}|02[0-9]{2}|03[0-9]{2}){1}?(\s|\.|\-)?([0-9]{3}(\s|\.|\-|)){2}$/gim,
            "Please add a valid phone number",
        ],
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: [6, "Password should be at least 6 characters long"],
        select: false, // when we get the user through the API, it is not going to show the password
    },
    resetPasswordToken: String, // reset functionality
    resetPasswordExpire: Date, // expiration date
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    isWarned: {
        type: Boolean,
        required: true,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        required: true,
        default: false,
    },
    avatar: {
        type: String,
        default: "default-avatar.jpg",
    },
    address: {
        type: String,
        required: [true, "Please add an address"],
    },
    location: {
        // GeoJSON Point
        type: {
            type: String,
            enum: ["Point"], // enum - can be one of the following values
            // required: true,
        },
        coordinates: {
            type: [Number], // array of numbers
            index: "2dsphere",
            // required: true,
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
    },
    trustScore: {
        type: Number,
        required: true,
        default: 0.0,
    },
    schedules: {
        type: [ScheduleSchema],
        default: [],
    },
}, {
    timestamps: true,
});

// encrypt password using bcrypt
UserSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        next();
    } else {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
});

// geocode & create location field
UserSchema.pre("save", async function(next) {
    if (!this.isModified("address")) {
        next();
    } else {
        try {
            const location = await geocoder.geocode(this.address);
            this.location = {
                type: "Point",
                coordinates: [location[0].longitude, location[0].latitude],
                formattedAddress: location[0].formattedAddress,
                street: location[0].streetName,
                city: location[0].city,
                state: location[0].stateCode,
                zipcode: location[0].zipcode,
                country: location[0].countryCode,
            };
        } catch (error) {
            console.log(error.message);
        }

        // do not save address in the db
        // this.address = undefined; // doesn't get put in the JSON

        next();
    }
});

// cascade delete services when a user is removed
UserSchema.pre("remove", async function(next) {
    console.log(`Services being removed for user with id ${this._id}`);
    await this.model("Service").deleteMany({ user: this._id });
    next();
});

// sign JWT and return
// methods - called on instance
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
    // generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // set the expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model("User", UserSchema);

export default User;