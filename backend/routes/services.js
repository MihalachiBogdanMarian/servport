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
import { checkDocumentExistence, checkDocumentOwnership, checkObjectIds } from "../middleware/objectIdsValidations.js";
import Service from "../models/Service.js";

const router = express.Router({ mergeParams: true });

router.route("/").get(advancedResults(Service), getServices).post(protect, addService);

router.route("/myservices").get(protect, getMyServices);

router
    .route("/:id")
<<<<<<< HEAD
    .get(checkObjectIds(["id"]), checkDocumentExistence(Service, "id", "user", "name phone email avatar trustScore"), getService)
=======
    .get(
        checkObjectIds(["id"]),
        checkDocumentExistence(Service, "id", "user", "name phone email avatar trustScore"),
        getService
    )
>>>>>>> 056ac5293dee09ef9b3d8eccfee62b73c380fa9b
    .put(
        checkObjectIds(["id"]),
        protect,
        checkDocumentExistence(Service, "id"),
        checkDocumentOwnership(Service),
        updateService
    )
    .delete(
        checkObjectIds(["id"]),
        protect,
        checkDocumentExistence(Service, "id"),
        checkDocumentOwnership(Service),
        deleteService
    );

router
    .route("/:id/percentage")
    .get(checkObjectIds(["id"]), protect, checkDocumentExistence(Service, "id"), getPricePercentage);

router
    .route("/:id/availabilityperiods")
    .post(
        checkObjectIds(["id"]),
        protect,
        checkDocumentExistence(Service, "id"),
        checkDocumentOwnership(Service),
        addAvailabilityPeriods
    )
    .delete(
        checkObjectIds(["id"]),
        protect,
        checkDocumentExistence(Service, "id"),
        checkDocumentOwnership(Service),
        removeAvailabilityPeriods
    );

router
    .route("/:id/payment")
    .get(
        checkObjectIds(["id"]),
        protect,
        checkDocumentExistence(Service, "id"),
        checkDocumentOwnership(Service),
        getPaymentCanProceedUsers
    )
    .put(
        checkObjectIds(["id"]),
        protect,
        checkDocumentExistence(Service, "id"),
        checkDocumentOwnership(Service),
        addUsersToPayment
    );

router
    .route("/:id/images")
    .put(
        checkObjectIds(["id"]),
        protect,
        checkDocumentExistence(Service, "id"),
        checkDocumentOwnership(Service),
        uploadServiceImages
    );

router.route("/toprated/:category/:number").get(getTopRatedServicesPerCategory);

router.route("/distanceradius/:address/:distance").get(getServicesInDistanceRadius);

router.route("/textsearch/:description").get(getServicesByDescription);

export default router;