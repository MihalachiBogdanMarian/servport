import express from "express";
import {
    addRequestServiceOffers,
    getMyRequests,
    getRequest,
    getRequests,
    updateRequestToFinishedProvided,
    updateRequestToPaid,
} from "../controllers/requests.js";
import advancedResults from "../middleware/advancedResults.js";
import { authorizeAdmin, protect } from "../middleware/auth.js";
import { checkDocumentExistence, checkObjectIds } from "../middleware/objectIdsValidations.js";
import Request from "../models/Request.js";

const router = express.Router({ mergeParams: true });

router
    .route("/")
    .get(protect, authorizeAdmin, advancedResults(Request), getRequests)
    .post(protect, addRequestServiceOffers);

router.route("/myrequests").get(protect, getMyRequests);

router
    .route("/:id")
    .get(checkObjectIds(["id"]), checkDocumentExistence(Request, "id", "user", "name phone email"), protect, getRequest);

router
    .route("/:id/pay")
    .get(
        checkObjectIds(["id"]),
        checkDocumentExistence(Request, "id", "requestServices.service", "user"),
        protect,
        updateRequestToPaid
    );

router
    .route("/:id/provide")
    .get(checkObjectIds(["id"]), checkDocumentExistence(Request, "id"), protect, updateRequestToFinishedProvided);

export default router;