import path from "path";
import asyncHandler from "../middleware/async.js";
import Service from "../models/Service.js";
import ErrorResponse from "../utils/errorResponse.js";

// @desc    get all services
// @route   GET /api/v1/services
// @access  public
const getServices = asyncHandler(async(req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc    create new service
// @route   POST /api/v1/services
// @access  private
const addService = asyncHandler(async(req, res, next) => {});

// @desc    get logged in user services
// @route   GET /api/v1/services/myservices
// @access  private
const getMyServices = asyncHandler(async(req, res, next) => {
    const services = await Service.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        data: services,
    });
});

// @desc    get service by ID
// @route   GET /api/v1/services/:id
// @access  public
const getService = asyncHandler(async(req, res, next) => {
    const service = await Service.findById(req.params.id).populate("user", "name email phone");

    if (!service) {
        return next(new ErrorResponse(`No service with the id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: service,
    });
});

// @desc    update service info
// @route   PUT /api/v1/services/:id
// @access  private
const updateService = asyncHandler(async(req, res, next) => {});

// @desc    delete service
// @route   DELETE /api/v1/services/:id
// @access  private
const deleteService = asyncHandler(async(req, res, next) => {});

// @desc    get percentage of how many services have the price greater than the price of the given service
// @route   GET /api/v1/services/:id/percentage
// @access  private
const getPricePercentage = asyncHandler(async(req, res, next) => {
    const service = await Service.findById(req.params.id);

    if (!service) {
        return next(new ErrorResponse(`No service with the id of ${req.params.id}`, 404));
    }

    numServicesGreaterPrice = await Service.aggregate([{
            $unwind: "$ratings",
        },
        {
            $group: {
                _id: {
                    _id: "$_id",
                    title: "$title",
                },
                ratings: {
                    $push: "$ratings",
                },
                ratings_average: {
                    $avg: "$ratings.rating",
                },
            },
        },
        {
            $project: {
                _id: 0,
                title: "$_id.title",
                ratings_average: 1,
                ratings: 1,
            },
        },
    ]);

    totalNumServices = await Service.res.status(200).json({
        success: true,
        data: (numServicesGreaterPrice * totalNumServices) / 100,
    });
});

// @desc    add availability periods to the service
// @route   POST /api/v1/services/:id/availabilityperiods
// @access  private
const addAvailabilityPeriods = asyncHandler(async(req, res, next) => {});

// @desc    remove availability periods from the service
// @route   DELETE /api/v1/services/:id/availabilityperiods
// @access  private
const removeAvailabilityPeriods = asyncHandler(async(req, res, next) => {});

// @desc    get list of users who can proceed to payment
// @route   GET /api/v1/services/:id/payment
// @access  private
const getPaymentCanProceedUsers = asyncHandler(async(req, res, next) => {});

// @desc    add users to the list of users who can proceed to payment
// @route   PUT /api/v1/services/:id/payment
// @access  private
const addUsersToPayment = asyncHandler(async(req, res, next) => {});

// @desc    upload service images
// @route   PUT /api/v1/services/:id/images
// @access  private
const uploadServiceImages = asyncHandler(async(req, res, next) => {
    const service = await Service.findById(req.params.id);

    if (!service) {
        return next(new ErrorResponse(`Service not found with id of ${req.params.id}`, 404));
    }

    if (!req.files) {
        return next(new ErrorResponse("Please upload a file", 400));
    }

    const files = req.files[Object.keys(req.files)[0]];

    // make sure that all images are photos
    files.forEach((file) => {
        if (!file.mimetype.startsWith("image")) {
            return next(new ErrorResponse("Please upload only image files", 400));
        }
    });

    // check file sizes
    files.forEach((file) => {
        if (file.size > process.env.MAX_FILE_UPLOAD) {
            return next(new ErrorResponse(`All images need to be less than ${process.env.MAX_FILE_UPLOAD}`, 400));
        }
    });

    // create custom filenames
    files.forEach(function(part, index, theArray) {
        theArray[index].name = `${theArray[index].name.split(".")[0]}_${Date.now()}${path.parse(theArray[index].name).ext}`;
    });

    let filenames = [];
    files.forEach((file) => {
        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async(err) => {
            if (err) {
                console.log(err);
                return next(new ErrorResponse("Problem with files upload", 500));
            }
        });

        filenames.push(file.name);
    });

    await Service.findByIdAndUpdate({ _id: req.params.id }, { $push: { images: { $each: filenames } } });

    res.status(200).json({ success: true, data: filenames });
});

// @desc    get top number services based on reviews for a specific category
// @route   GET /api/v1/services/toprated/:category/:number
// @access  public
const getTopRatedServicesPerCategory = asyncHandler(async(req, res, next) => {});

// @desc    get services in distance radius of a specific address
// @route   GET /api/v1/services/distanceradius/:address/:distance
// @access  public
const getServicesInDistanceRadius = asyncHandler(async(req, res, next) => {});

// @desc    get services which match best a given description
// @route   GET /api/v1/services/textsearch/:description
// @access  public
const getServicesByDescription = asyncHandler(async(req, res, next) => {});

export {
    getServices,
    addService,
    getMyServices,
    getService,
    updateService,
    deleteService,
    getPricePercentage,
    addAvailabilityPeriods,
    removeAvailabilityPeriods,
    getPaymentCanProceedUsers,
    addUsersToPayment,
    uploadServiceImages,
    getTopRatedServicesPerCategory,
    getServicesInDistanceRadius,
    getServicesByDescription,
};