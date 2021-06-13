import crypto from "crypto";
import asyncHandler from "../middleware/async.js";
import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";
import sendEmail from "../utils/sendEmail.js";
import sendTokenResponse from "../utils/sendTokenResponse.js";

// @desc    register user
// @route   POST /api/v1/auth/register
// @access  public
const register = asyncHandler(async(req, res, next) => {
    const { name, email, phone, password, address } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        // Bad Request
        return next(new ErrorResponse("User already exists", 400));
    }

    // create user
    const user = await User.create({
        name,
        email,
        phone,
        password,
        address,
    });

    if (user) {
        // get token from model, create cookie and send response
        sendTokenResponse(user, 200, res);
    } else {
        // Bad Request
        return next(new ErrorResponse("Invalid user data", 400));
    }
});

// @desc    login user
// @route   POST /api/v1/auth/login
// @access  public
const login = asyncHandler(async(req, res, next) => {
    const { email, password } = req.body;

    // validate email and password
    if (!email || !password) {
        return next(new ErrorResponse("Please provide an email and a password", 400));
    }

    // check for user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        // Unauthorized
        return next(new ErrorResponse("Invalid credentials", 401));
    }

    // check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        // Unauthorized
        return next(new ErrorResponse("Invalid credentials", 401));
    }

    // get token from model, create cookie and send response
    sendTokenResponse(user, 200, res);
});

// @desc    log user out / clear cookie
// @route   GET /api/v1/auth/logout
// @access  private
const logout = asyncHandler(async(req, res, next) => {
    res.cookie("token", "none", { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });

    res.status(200).json({ success: true, data: {} });
});

// @desc    get current logged in user
// @route   GET /api/v1/auth/me
// @access  private
const getMe = asyncHandler(async(req, res, next) => {
    // user is already available in req due to the protect middleware
    // so no need for await User.findById(req.user.id);
    const user = req.user;

    res.status(200).json({ success: true, data: user });
});

// @desc    forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  public
const forgotPassword = asyncHandler(async(req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorResponse("There is no user with that email", 404));
    }

    // get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // create reset url
    // const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/resetpassword/${resetToken}`;
    const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`;

    // in the front-end part, there would be a link where users could click
    const message = `You are receiving this email because you need to confirm your email address. Please access the following link within 10 minutes and type a new password: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Password Reset Token",
            message,
        });

        return res.status(200).json({ success: true, data: "Email sent" });
    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse("Email could not be sent", 500));
    }
});

// @desc    reset password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  public
const resetPassword = asyncHandler(async(req, res, next) => {
    // get hashed token
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resettoken).digest("hex");

    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });

    if (!user) {
        return next(new ErrorResponse("Invalid token", 400));
    }

    // set the new password - will hit the middleware pre-save which will encrypt the new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
});

// @desc    update password
// @route   PUT /api/v1/auth/updatepassword
// @access  private
const updatePassword = asyncHandler(async(req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    // check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse("Password is incorrect", 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
});

export { register, login, logout, getMe, forgotPassword, resetPassword, updatePassword };