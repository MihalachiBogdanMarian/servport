import mongoose from "mongoose";
import { AvailabilityPeriodSchema } from "../models/Service.js";

const RequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    requestServices: [{
        title: { type: String, required: true },
        availabilityPeriod: { type: AvailabilityPeriodSchema, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        executionAddress: {
            address: {
                type: String,
                required: [true, "Please add the exact address where the service will be provided"],
            },
        },
        service: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Service",
        },
    }, ],
    paymentMethod: {
        type: String,
        required: [true, "Please add a payment method"],
    },
    paymentResult: {
        // data from PayPal
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String },
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    isFinishedProvided: {
        type: Boolean,
        required: true,
        default: false,
    },
    finishedProvidedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

const Request = mongoose.model("Request", RequestSchema);

export default Request;