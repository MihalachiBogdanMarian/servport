import mongoose from "mongoose";
import ErrorResponse from "../utils/errorResponse.js";

// middleware to check for valid object ids
const checkObjectIds = (idsToCheck) => (req, res, next) => {
    idsToCheck.forEach((idToCheck) => {
        if (!mongoose.Types.ObjectId.isValid(req.params[idToCheck])) return next(new ErrorResponse("Invalid ID", 400));
    });
    next();
};

export default checkObjectIds;