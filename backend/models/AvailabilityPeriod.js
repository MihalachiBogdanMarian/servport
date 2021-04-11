import mongoose from "mongoose";

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

export default AvailabilityPeriodSchema;