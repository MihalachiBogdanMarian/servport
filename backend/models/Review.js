import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "Please add a title for the review"],
        maxlength: [300, "Cannot exceed 300 characters"],
    },
    comment: {
        type: String,
        required: [true, "Please add some text"],
    },
    rating: {
        type: Number,
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating mustn't be more than 5"],
        required: [true, "Please add a rating between 1 and 5"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});

export default ReviewSchema;