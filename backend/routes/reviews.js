import express from "express";
import { addReview, removeReview, starReview } from "../controllers/reviews.js";
import { protect } from "../middleware/auth.js";
import checkObjectIds from "../middleware/checkObjectIds.js";

const router = express.Router({ mergeParams: true });

router.route("/").post(checkObjectIds(["serviceId"]), protect, addReview);
router.route("/:reviewId").delete(checkObjectIds(["serviceId", "reviewId"]), protect, removeReview);
router.route("/:reviewId/stars").post(checkObjectIds(["serviceId", "reviewId"]), protect, starReview);

export default router;