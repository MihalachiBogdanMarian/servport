import mongoose from "mongoose";
import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "./async.js";

// middleware to check for valid object ids
const checkObjectIds = (idsToCheck) => (req, res, next) => {
    idsToCheck.forEach((idToCheck) => {
        if (!mongoose.Types.ObjectId.isValid(req.params[idToCheck])) return next(new ErrorResponse("Invalid ID", 400));
    });
    next();
};

// middleware to check for document existence in db
const checkDocumentExistence = (model, id, populateModel = "", populateFields = "", selectFields = "") =>
    asyncHandler(async(req, res, next) => {
        const modelName = model.collection.collectionName.slice(0, -1);

        let document = undefined;
        if (modelName === "service") {
            document = await model
                .findById(req.params[id])
                .populate(populateModel, populateFields)
                .populate({ path: "reviews", populate: { path: "user", select: "name" } })
                .select(selectFields);
        } else {
            document = await model.findById(req.params[id]).populate(populateModel, populateFields).select(selectFields);
        }

        if (!document) {
            return next(new ErrorResponse(`No ${modelName} with the id of ${req.params[id]}`, 404));
        }

        req.document = document;

        next();
    });

// middleware to check for ownership of document in db
const checkDocumentOwnership = (model) => (req, res, next) => {
    const document = req.document;

    const modelName = model.collection.collectionName.slice(0, -1);

    // make sure logged in user is document owner
    if (document.user.toString() !== req.user.id) {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to modify/get info about ${modelName} with the id of ${document._id}`,
                401
            )
        );
    }
    next();
};

export { checkObjectIds, checkDocumentExistence, checkDocumentOwnership };