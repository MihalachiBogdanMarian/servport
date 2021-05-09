import express from "express";
import {
    addAvailabilityPeriods,
    addService,
    addUsersToPayment,
    deleteService,
    getMyServices,
    getPaymentCanProceedUsers,
    getPricePercentage,
    getService,
    getServices,
    getServicesByDescription,
    getServicesInDistanceRadius,
    getTopRatedServicesPerCategory,
    removeAvailabilityPeriods,
    updateService,
    uploadServiceImages,
} from "../controllers/services.js";
import advancedResults from "../middleware/advancedResults.js";
import { protect } from "../middleware/auth.js";
import checkObjectIds from "../middleware/checkObjectIds.js";
import Service from "../models/Service.js";

const router = express.Router({ mergeParams: true });

router.route("/").get(advancedResults(Service), getServices).post(protect, addService);
router.route("/myservices").get(protect, getMyServices);
router
    .route("/:id")
    .get(checkObjectIds(["id"]), getService)
    .put(checkObjectIds(["id"]), protect, updateService)
    .delete(checkObjectIds(["id"]), protect, deleteService);
router.route("/:id/percentage").get(checkObjectIds(["id"]), protect, getPricePercentage);
router
    .route("/:id/availabilityperiods")
    .post(checkObjectIds(["id"]), protect, addAvailabilityPeriods)
    .delete(checkObjectIds(["id"]), protect, removeAvailabilityPeriods);
router
    .route("/:id/payment")
    .get(checkObjectIds(["id"]), protect, getPaymentCanProceedUsers)
    .put(protect, addUsersToPayment);
router.route("/:id/images").put(checkObjectIds(["id"]), protect, uploadServiceImages);
router.route("/toprated/:category/:number").get(getTopRatedServicesPerCategory);
router.route("/distanceradius/:address/:distance").get(getServicesInDistanceRadius);
router.route("/textsearch/:description").get(getServicesByDescription);

export default router;