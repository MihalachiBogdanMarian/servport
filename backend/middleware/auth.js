import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "./async.js";

// protect routes
const protect = asyncHandler(async(req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        // search for the token in the header
        token = req.headers.authorization.split(" ")[1];
    }
    // else if (req.cookies.token) {
    //     // search for the token in the cookies jar
    //     token = req.cookies.token;
    // }

    // make sure token exists
    if (!token) {
        // Unauthorized
        return next(new ErrorResponse("Not authorized to access this route", 401));
    }

    try {
        // verify token - decoded = id + iat + exp
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // currently logged in user
        req.user = await User.findById(decoded.id).select("-password");

        next();
    } catch (error) {
        // Unauthorized
        return next(new ErrorResponse("Not authorized to access this route", 401));
    }
});

// grant access only to admin user
const authorizeAdmin = asyncHandler(async(req, res, next) => {
    if (!req.user.isAdmin) {
        // Forbidden
        return next(new ErrorResponse("Non-admin user is unauthorized to access this route", 403));
    }
    next();
});

export { protect, authorizeAdmin };