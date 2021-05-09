import asyncHandler from "../middleware/async.js";
import Request from "../models/Request.js";
import ErrorResponse from "../utils/errorResponse.js";

// @desc    get all requests
// @route   GET /api/v1/requests
// @access  private/admin
const getRequests = asyncHandler(async(req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc    create new request
// @route   POST /api/v1/requests
// @access  private
const addRequestServiceOffers = asyncHandler(async(req, res, next) => {
    const { requestServices, paymentMethod, price } = req.body;

    if (requestServices && requestServices.length === 0) {
        res.status(400);
        return next(new ErrorResponse("No request services", 400));
    }

    let request = {
        user: req.user._id,
        requestServices,
        paymentMethod,
        price,
    };

    request = await Request.create(request);

    res.status(200).json({
        success: true,
        data: request,
    });
});

// @desc    get request by ID
// @route   GET /api/v1/requests/:id
// @access  private
const getRequest = asyncHandler(async(req, res, next) => {
    const request = await Request.findById(req.params.id).populate("user", "name email");

    if (!request) {
        return next(new ErrorResponse(`No request with the id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: request,
    });
});

// @desc    update request to paid
// @route   GET /api/v1/requests/:id/pay
// @access  private
const updateRequestToPaid = asyncHandler(async(req, res, next) => {
    let request = await Request.findById(req.params.id);

    if (!request) {
        return next(new ErrorResponse(`No request with the id of ${req.params.id}`, 404));
    }

    request = await Request.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            isPaid: true,
            paidAt: Date.now(),
            paymentResult: {
                id: req.body.id || "",
                status: req.body.status || "",
                update_time: req.body.update_time || "",
                email_address: req.body.payer ? req.body.payer.email_address : "",
            },
        },
    });

    if (!request) {
        return next(new ErrorResponse("Error updating paid", 500));
    }

    request = await Request.findById(req.params.id);

    res.status(200).json({
        success: true,
        data: request,
    });
});

// @desc    update request to finished provided
// @route   GET /api/v1/requests/:id/provide
// @access  private/admin
const updateRequestToFinishedProvided = asyncHandler(async(req, res, next) => {
    let request = await Request.findById(req.params.id);

    if (!request) {
        return next(new ErrorResponse(`No request with the id of ${req.params.id}`, 404));
    }

    request = await Request.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            isFinishedProvided: true,
            finishedProvidedAt: Date.now(),
        },
    });

    if (!request) {
        return next(new ErrorResponse("Error updating finished provided", 500));
    }

    request = await Request.findById(req.params.id);

    res.status(200).json({
        success: true,
        data: request,
    });
});

// @desc    get logged in user requests
// @route   GET /api/v1/requests/myrequests
// @access  private
const getMyRequests = asyncHandler(async(req, res, next) => {
    const requests = await Request.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        data: requests,
    });
});

export {
    getRequests,
    addRequestServiceOffers,
    getRequest,
    updateRequestToPaid,
    updateRequestToFinishedProvided,
    getMyRequests,
};