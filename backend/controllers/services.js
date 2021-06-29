import mongoose from "mongoose";
import path from "path";
import asyncHandler from "../middleware/async.js";
import Service from "../models/Service.js";
import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";
import geocoder from "../utils/geocoder.js";
import getPagination from "../utils/getPagination.js";
import { areDateIntervalsOverlapping } from "../utils/utilities.js";

// @desc    get all services
// @route   GET /api/v1/services
// @access  public
// {{URL}}/api/v1/services?page=1&limit=1&price[minPrice]=585&title=Authorized repair service engineer&price[maxPrice][eq]=841
const getServices = asyncHandler(async(req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc    create new service
// @route   POST /api/v1/services
// @access  private
const addService = asyncHandler(async(req, res, next) => {
    const service = await Service.create({...req.body, user: req.user._id });

    res.status(200).json({
        success: true,
        data: service,
    });
});

// @desc    get logged in user services
// @route   GET /api/v1/services/myservices
// @access  private
const getMyServices = asyncHandler(async(req, res, next) => {
    let query = Service.find({ user: req.user._id }).sort({ createdAt: -1 });

    const { pagination, results } = await getPagination(req, Service, query, "", "2");

    res.status(200).json({ success: true, count: results.length, pagination, data: results });
});

// @desc    get service by ID
// @route   GET /api/v1/services/:id
// @access  public
const getService = asyncHandler(async(req, res, next) => {
    const service = req.document;

    const serviceAveragePrice = (service.price.minPrice + service.price.maxPrice) / 2;

    const numServicesGreaterPricePromise = async() => {
        return await Service.aggregate([{
                $unwind: "$price",
            },
            {
                $addFields: {
                    averagePrice: { $divide: [{ $add: ["$price.minPrice", "$price.maxPrice"] }, 2] },
                },
            },
            {
                $match: {
                    $and: [
                        { _id: { $ne: mongoose.Types.ObjectId(req.params.id) } },
                        { category: service.category },
                        {
                            averagePrice: {
                                $gte: serviceAveragePrice,
                            },
                        },
                    ],
                },
            },
            {
                $count: "count",
            },
        ]);
    };

    const totalNumServicesPromise = async() => {
        return await Service.find({ category: service.category }).countDocuments();
    };

    await Promise.all([numServicesGreaterPricePromise(), totalNumServicesPromise()])
        .then((values) => {
            const [numServicesGreaterPrice, totalNumServices] = values;
            res.status(200).json({
                success: true,
                data: {
                    service: req.document,
                    pricePercentage: (
                        ((numServicesGreaterPrice.length === 0 ? 0 : numServicesGreaterPrice[0].count) / totalNumServices) *
                        100
                    ).toFixed(2),
                },
            });
        })
        .catch((error) => {
            return next(new ErrorResponse("Problem with counting documents", 500));
        });
});

// @desc    update service info
// @route   PUT /api/v1/services/:id
// @access  private
const updateService = asyncHandler(async(req, res, next) => {
    const { title, description, category, price, images, availabilityPeriods, addresses } = req.body;

    let service = req.document;

    service.title = req.body.title || service.title;
    service.description = req.body.description || service.description;
    service.category = req.body.category || service.category;
    service.price = req.body.price || service.price;
    service.addresses = req.body.addresses || service.addresses;
    service.numViews = req.body.numViews || service.numViews;
    service.numInterested = req.body.numInterested || service.numInterested;

    const updatedService = await service.save();

    res.status(200).json({
        success: true,
        data: updatedService,
    });
});

// @desc    delete service
// @route   DELETE /api/v1/services/:id
// @access  private
const deleteService = asyncHandler(async(req, res, next) => {
    await Service.deleteOne({ _id: req.params.id });

    res.status(200).json({
        success: true,
        message: "Service removed",
    });
});

// @desc    get percentage of how many services have the average price
//          greater than the average price of the given service
// @route   GET /api/v1/services/:id/percentage
// @access  private
const getPricePercentage = asyncHandler(async(req, res, next) => {
    const service = req.document;

    const serviceAveragePrice = (service.price.minPrice + service.price.maxPrice) / 2;

    const numServicesGreaterPricePromise = async() => {
        return await Service.aggregate([{
                $unwind: "$price",
            },
            {
                $addFields: {
                    averagePrice: { $divide: [{ $add: ["$price.minPrice", "$price.maxPrice"] }, 2] },
                },
            },
            {
                $match: {
                    $and: [
                        { _id: { $ne: mongoose.Types.ObjectId(req.params.id) } },
                        { category: service.category },
                        {
                            averagePrice: {
                                $gte: serviceAveragePrice,
                            },
                        },
                    ],
                },
            },
            {
                $count: "count",
            },
        ]);
    };

    const totalNumServicesPromise = async() => {
        return await Service.find({ category: service.category }).countDocuments();
    };

    await Promise.all([numServicesGreaterPricePromise(), totalNumServicesPromise()])
        .then((values) => {
            const [numServicesGreaterPrice, totalNumServices] = values;
            res.status(200).json({
                success: true,
                data: (
                    ((numServicesGreaterPrice.length === 0 ? 0 : numServicesGreaterPrice[0].count) / totalNumServices) *
                    100
                ).toFixed(2),
            });
        })
        .catch((error) => {
            return next(new ErrorResponse("Problem with counting documents", 500));
        });
});

// @desc    add availability periods to the service
// @route   POST /api/v1/services/:id/availabilityperiods
// @access  private
const addAvailabilityPeriods = asyncHandler(async(req, res, next) => {
    const { availabilityPeriods } = req.body;

    if (availabilityPeriods && availabilityPeriods.length === 0) {
        res.status(400);
        return next(new ErrorResponse("No availability periods", 400));
    }

    let service = req.document;

    let dateIntervalsUnfolded = [];
    service.availabilityPeriods.forEach((availabilityPeriod) =>
        dateIntervalsUnfolded.push(availabilityPeriod.startTime, availabilityPeriod.endTime)
    );
    availabilityPeriods.forEach((availabilityPeriod) =>
        dateIntervalsUnfolded.push(new Date(availabilityPeriod.startTime), new Date(availabilityPeriod.endTime))
    );

    if (areDateIntervalsOverlapping(...dateIntervalsUnfolded)) {
        return next(
            new ErrorResponse(
                "You cannot add availability periods which overlap between them or with the existing availability periods",
                400
            )
        );
    }

    availabilityPeriods.forEach((availabilityPeriod) => {
        const index = service.availabilityPeriods.findIndex((ap) => ap.startTime >= new Date(availabilityPeriod.startTime));
        if (index === -1) {
            service.availabilityPeriods.push(availabilityPeriod);
        } else {
            service.availabilityPeriods.splice(index, 0, availabilityPeriod);
        }
    });

    await service.save();

    res.status(200).json({ success: true, data: service });
});

// @desc    remove availability periods from the service
// @route   DELETE /api/v1/services/:id/availabilityperiods
// @access  private
const removeAvailabilityPeriods = asyncHandler(async(req, res, next) => {
    const { availabilityPeriodIds } = req.body;

    let service = req.document;

    service.availabilityPeriods = service.availabilityPeriods.filter(
        (availabilityPeriod) => !availabilityPeriodIds.includes(availabilityPeriod._id.toString())
    );

    await service.save();

    res.status(200).json({ success: true, data: service });
});

// @desc    get list of users who can proceed to payment
// @route   GET /api/v1/services/:id/payment
// @access  private
const getPaymentCanProceedUsers = asyncHandler(async(req, res, next) => {
    const service = req.document;

    res.status(200).json({ success: true, data: service.paymentCanProceedUsers });
});

// @desc    add users to the list of users who can proceed to payment
// @route   PUT /api/v1/services/:id/payment
// @access  private
const addUsersToPayment = asyncHandler(async(req, res, next) => {
    let { phonesAndPrices, emailsAndPrices } = req.body;

    phonesAndPrices = phonesAndPrices || [];
    emailsAndPrices = emailsAndPrices || [];

    let service = req.document;

    const ids = await User.aggregate([{
            $match: {
                $or: [
                    { phone: { $in: phonesAndPrices.map((phoneAndPrice) => phoneAndPrice.phone) } },
                    { email: { $in: emailsAndPrices.map((emailAndPrice) => emailAndPrice.email) } },
                ],
            },
        },
        {
            $project: {
                _id: 1,
            },
        },
    ]);

    let i = -1;
    const phoneIdsAndPrices = phonesAndPrices.map((phoneAndPrice) => {
        i += 1;
        return { user: ids[i]._id, price: phoneAndPrice.price };
    });
    const emailIdsAndPrices = emailsAndPrices.map((emailAndPrice) => {
        i += 1;
        return { user: ids[i]._id, price: emailAndPrice.price };
    });

    const idsAndPrices = phoneIdsAndPrices.concat(emailIdsAndPrices);

    service = await Service.findOneAndUpdate({ _id: req.params.id }, {
        $push: {
            paymentCanProceedUsers: {
                $each: idsAndPrices,
                $position: 0,
            },
        },
    }, { new: true });

    res.status(200).json({ success: true, data: service });
});

// @desc    upload service images
// @route   PUT /api/v1/services/:id/images
// @access  private
const uploadServiceImages = asyncHandler(async(req, res, next) => {
    const service = req.document;

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
const getTopRatedServicesPerCategory = asyncHandler(async(req, res, next) => {
    const { category, number } = req.params;

    const services = await Service.find({ category: category }).sort({ rating: -1 }).limit(parseInt(number));

    res.status(200).json({ success: true, count: services.length, data: services });
});

// @desc    get services in distance radius of a specific address
// @route   GET /api/v1/services/distanceradius/:address/:distance
// @access  public
const getServicesInDistanceRadius = asyncHandler(async(req, res, next) => {
    const { address, distance } = req.params;

    // get lat/long from geocoder
    const loc = await geocoder.geocode(address);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // calc radius using radians
    // divide distance by radius of Earth
    // Earth radius = 3.963 mi / 6.378 km
    const radius = parseInt(distance) / 6378;

    let query = Service.find({
        locations: {
            $elemMatch: {
                $geoWithin: {
                    $centerSphere: [
                        [lng, lat], radius
                    ],
                },
            },
        },
    });

    const { pagination, results } = await getPagination(req, Service, query);

    res.status(200).json({ success: true, count: results.length, pagination, data: results });
});

// @desc    get services which match best a given description
// @route   GET /api/v1/services/textsearch/:description
// @access  public
const getServicesByDescription = asyncHandler(async(req, res, next) => {
    const description = req.params.description;

    let query = Service.find({ $text: { $search: description } }, { score: { $meta: "textScore" } }).sort({
        score: { $meta: "textScore" },
    });

    const { pagination, results } = await getPagination(req, Service, query);

    res.status(200).json({ success: true, count: results.length, pagination, data: results });
});

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