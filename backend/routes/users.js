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
import checkObjectIds from "../middleware/checkObjectIds.js";
import User from "../models/User.js";

const router = express.Router({ mergeParams: true });

router.route("/").get(protect, authorizeAdmin, advancedResults(User), getUsers);
router
    .route("/:id")
    .get(checkObjectIds(["id"]), protect, authorizeAdmin, getUser)
    .delete(checkObjectIds(["id"]), protect, authorizeAdmin, deleteUser)
    .put(checkObjectIds(["id"]), protect, authorizeAdmin, updateUser);
router
    .route("/:id/profile")
    .get(checkObjectIds(["id"]), protect, getUserProfile)
    .put(checkObjectIds(["id"]), protect, updateUserProfile);
router.route("/:id/avatar").put(checkObjectIds(["id"]), protect, uploadProfileAvatar);
router.route("/:id/schedules").post(checkObjectIds(["id"]), protect, addSchedules);
router
    .route("/:userId/schedule/:scheduleId")
    .get(checkObjectIds(["userId", "scheduleId"]), protect, setScheduleCompleted);

export default router;