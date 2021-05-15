import ErrorResponse from "../utils/errorResponse.js";

const errorHandler = (err, req, res, next) => {
    let error = {...err };

    error.message = err.message;

    // log to console for dev
    console.log(err);

    // Mongoose bad ObjectId
    if (err.name === "CastError") {
        const message = "Resource not found";
        error = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = "Duplicate field value entered";
        error = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((value, index) =>
            index === 0 ? value.message : " " + value.message.toLowerCase()
        );
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        errorMessage: error.message || "Server Error",
    });
};

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

export { errorHandler, notFound };