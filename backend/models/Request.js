import mongoose from "mongoose";
import AvailabilityPeriodSchema from "./AvailabilityPeriod.js";

const RequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    requestServices: [{
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
        isFinishedProvided: {
            type: Boolean,
            required: true,
            default: false,
        },
        finishedProvidedAt: {
            type: Date,
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
    price: {
        type: Number,
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

// if all of the requests services are finished provided, then set the whole request to finished provided
RequestSchema.pre("save", function(next) {
    if (!this.isModified("requestServices")) {
        next();
    } else {
        const requestServicesFinishedProvided = this.requestServices.filter(
            (requestService) => requestService.isFinishedProvided
        ).length;
        const requestServicesTotalNum = this.requestServices.length;

        if (requestServicesFinishedProvided === requestServicesTotalNum) {
            this.isFinishedProvided = true;
            this.finishedProvidedAt = Date.now();
        }

        next();
    }
});

const Request = mongoose.model("Request", RequestSchema);

export default Request;