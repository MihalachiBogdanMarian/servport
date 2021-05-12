import express from "express";
import {
    addSchedules,
    deleteUser,
    getUser,
    getUserProfile,
    getUsers,
    setScheduleCompleted,
    updateUser,
    updateUserProfile,
    uploadProfileAvatar,
} from "../controllers/users.js";
import advancedResults from "../middleware/advancedResults.js";
import { authorizeAdmin, protect } from "../middleware/auth.js";
import { checkDocumentExistence, checkObjectIds } from "../middleware/objectIdsValidations.js";
import User from "../models/User.js";

const router = express.Router({ mergeParams: true });

router.route("/").get(protect, authorizeAdmin, advancedResults(User), getUsers);

router
    .route("/:id")
    .get(checkObjectIds(["id"]), protect, checkDocumentExistence(User, "id", "-password"), authorizeAdmin, getUser)
    .delete(checkObjectIds(["id"]), protect, checkDocumentExistence(User, "id", "-password"), authorizeAdmin, deleteUser)
    .put(
        checkObjectIds(["id"]),
        protect,
        checkDocumentExistence(
            User,
            "id",
            "-__v -createdAt -updatedAt -email -password -isAdmin -isWarned -isBlocked -schedules"
        ),
        authorizeAdmin,
        updateUser
    );

router
    .route("/:id/profile")
    .get(checkObjectIds(["id"]), protect, getUserProfile)
    .put(checkObjectIds(["id"]), protect, checkDocumentExistence(User, "id"), updateUserProfile);

router
    .route("/:id/avatar")
    .put(checkObjectIds(["id"]), protect, checkDocumentExistence(User, "id"), uploadProfileAvatar);

router.route("/:id/schedules").post(checkObjectIds(["id"]), protect, checkDocumentExistence(User, "id"), addSchedules);

router
    .route("/:userId/schedule/:scheduleId")
    .get(checkObjectIds(["userId", "scheduleId"]), protect, checkDocumentExistence(User, "userId"), setScheduleCompleted);

export default router;