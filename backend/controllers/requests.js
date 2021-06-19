import asyncHandler from "../middleware/async.js";
import Request from "../models/Request.js";
import Service from "../models/Service.js";
import User from "../models/User.js";
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
    const { requestServices, paymentMethod } = req.body;

    if (requestServices && requestServices.length === 0) {
        res.status(400);
        return next(new ErrorResponse("No request services", 400));
    }

    let request = {
        user: req.user._id,
        requestServices,
        paymentMethod,
        price: requestServices.length === 1 ?
            requestServices[0].price :
            requestServices.reduce((rs1, rs2) => rs1.price + rs2.price),
    };

    request = await Request.create(request);

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

// @desc    get request by ID
// @route   GET /api/v1/requests/:id
// @access  private
const getRequest = asyncHandler(async(req, res, next) => {
    const request = req.document;

    res.status(200).json({
        success: true,
        data: request,
    });
});

// @desc    update request to paid
// @route   GET /api/v1/requests/:id/pay
// @access  private
const updateRequestToPaid = asyncHandler(async(req, res, next) => {
    let request = req.document;

    // update request to paid
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
    }, { new: true }).populate("requestServices.service", "user");

    if (!request) {
        return next(new ErrorResponse("Error updating paid", 500));
    }

    // set users who proceeded to payment to have paid
    await Promise.all(
        request.requestServices.map(async(requestService) => {
            await Service.findOneAndUpdate({ _id: requestService.service }, { $set: { "paymentCanProceedUsers.$[myEntry].hasPaid": true } }, {
                arrayFilters: [{
                    "myEntry.user": req.user._id,
                }, ],
            });

            await Service.findOneAndUpdate({ _id: requestService.service }, { $set: { "availabilityPeriods.$[myEntry].scheduled": true } }, {
                arrayFilters: [{
                    "myEntry.startTime": requestService.availabilityPeriod.startTime,
                    "myEntry.endTime": requestService.availabilityPeriod.endTime,
                }, ],
            });

            const schedule = {
                title: requestService.title,
                availabilityPeriod: requestService.availabilityPeriod,
                price: requestService.price,
                executionAddress: requestService.executionAddress,
                service: requestService.service,
            };
            await User.findOneAndUpdate({ _id: requestService.service.user }, { $push: { schedules: schedule } });
        })
    );

    res.status(200).json({
        success: true,
        data: request,
    });
});

// @desc    update request to finished provided
// @route   GET /api/v1/requests/:id/provide
// @access  private/admin
const updateRequestToFinishedProvided = asyncHandler(async(req, res, next) => {
    let request = req.document;

    request = await Request.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            isFinishedProvided: true,
            finishedProvidedAt: Date.now(),
        },
    }, { new: true });

    if (!request) {
        return next(new ErrorResponse("Error updating finished provided", 500));
    }

    res.status(200).json({
        success: true,
        data: request,
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