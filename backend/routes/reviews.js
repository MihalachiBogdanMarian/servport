import express from "express";
import { addReview, removeReview, starReview } from "../controllers/reviews.js";
import { protect } from "../middleware/auth.js";
import { checkDocumentExistence, checkObjectIds } from "../middleware/objectIdsValidations.js";
import Service from "../models/Service.js";

const router = express.Router({ mergeParams: true });

router.route("/").post(checkObjectIds(["serviceId"]), protect, checkDocumentExistence(Service, "serviceId"), addReview);

router
    .route("/:reviewId")
    .delete(
        checkObjectIds(["serviceId", "reviewId"]),
        protect,
        checkDocumentExistence(Service, "serviceId"),
        removeReview
    );

router
    .route("/:reviewId/stars")
    .put(checkObjectIds(["serviceId", "reviewId"]), protect, checkDocumentExistence(Service, "serviceId"), starReview);

export default router;