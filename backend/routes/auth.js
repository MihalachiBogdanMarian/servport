import express from "express";
import { forgotPassword, getMe, login, logout, register, resetPassword, updatePassword } from "../controllers/auth.js";
import { protect } from "../middleware/auth.js";

const router = express.Router({ mergeParams: true });

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/logout").get(logout);

router.route("/me").get(protect, getMe);

router.route("/forgotpassword").post(forgotPassword);

router.route("/resetpassword/:resettoken").put(resetPassword);

router.route("/updatePassword").put(protect, updatePassword);

export default router;