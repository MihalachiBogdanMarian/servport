import path from "path";
import asyncHandler from "../middleware/async.js";
import Request from "../models/Request.js";
import Service from "../models/Service.js";
import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";

// @desc    get all users
// @route   GET /api/v1/users
// @access  private/admin
const getUsers = asyncHandler(async(req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc    get user by id
// @route   GET /api/v1/users/:id
// @access  private/admin
const getUser = asyncHandler(async(req, res, next) => {
    res.status(200).json({
        success: true,
        data: req.document,
    });
});

// @desc    delete user account
// @route   DEL /api/v1/users/:id
// @access  private/admin
const deleteUser = asyncHandler(async(req, res, next) => {
    const user = req.document;

    await user.remove();

    res.status(200).json({
        success: true,
        message: "User removed",
    });
});

// @desc    update user admin managed fields (isAdmin, isWarned, isBlocked)
// @route   PUT /api/v1/users/:id
// @access  private/admin
const updateUser = asyncHandler(async(req, res, next) => {
    let user = req.document;

    user.isAdmin = req.body.isAdmin || false;
    user.isWarned = req.body.isWarned || false;
    user.isBlocked = req.body.isBlocked || false;

    const updatedUser = await user.save();

    res.status(200).json({
        success: true,
        data: updatedUser,
    });
});

// @desc    get user profile
// @route   GET /api/v1/users/:id/profile
// @access  private
const getUserProfile = asyncHandler(async(req, res, next) => {
    const user = req.document;

    const services = await Service.find({ user: user._id }).select(
        "-_id, -__v -createdAt -updatedAt -cluster -labels -user -paymentCanProceedUsers -previousRating"
    );

    const userProfile = {
        location: user.location,
        avatar: user.avatar,
        trustScore: user.trustScore,
        name: user.name,
        phone: user.phone,
        address: user.address,
        services,
    };

    res.status(200).json({
        success: true,
        data: userProfile,
    });
});

// @desc    update user info on profile
// @route   PUT /api/v1/users/:id/profile
// @access  private
const updateUserProfile = asyncHandler(async(req, res, next) => {
    const { name, phone, address } = req.body;

    let user = req.document;

    if (user._id.toString() !== req.user._id.toString()) {
        return next(new ErrorResponse("You cannot update someone elses profile", 400));
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    const updatedUserProfile = await user.save();

    res.status(200).json({
        success: true,
        data: updatedUserProfile,
    });
});

// @desc    add schedule to user
// @route   POST /api/v1/users/:id/schedules
// @access  private
const addSchedules = asyncHandler(async(req, res, next) => {
    const { schedules } = req.body;

    let user = req.document;

    if (user._id.toString() !== req.user._id.toString()) {
        return next(new ErrorResponse("You cannot add schedules for someone else", 400));
    }

    const userServices = (await Service.find({ user: req.params.id }).select("_id")).map((idObject) =>
        idObject._id.toString()
    );

    schedules.forEach((schedule) => {
        if (!userServices.includes(schedule.service.toString())) {
            return next(new ErrorResponse("Cannot add schedule for user which contains not only users services", 500));
        }
    });

    user = await User.findOneAndUpdate({ _id: req.params.id }, { $push: { schedules: { $each: schedules } } }, { new: true });

    if (!user) {
        return next(new ErrorResponse("Something went wrong with the adding", 500));
    }

    res.status(200).json({
        success: true,
        data: user,
    });
});

// @desc    set user schedule to completed
// @route   GET /api/v1/users/:userId/schedule/:scheduleId
// @access  private
const setScheduleCompleted = asyncHandler(async(req, res, next) => {
    const user = req.document;

    const schedule = user.schedules.find((schedule) => schedule._id.toString() === req.params.scheduleId.toString());

    if (!schedule) {
        return next(new ErrorResponse(`No schedule with the id of ${req.params.scheduleId}`, 404));
    }

    // set schedule completed
    await User.updateOne({ _id: req.params.userId, "schedules._id": req.params.scheduleId }, {
        $set: {
            "schedules.$.completed": true,
        },
    });

    // update the service in the request to finished provided
    const request = await Request.findOne({
        requestServices: {
            $elemMatch: {
                service: schedule.service,
                availabilityPeriod: schedule.availabilityPeriod,
            },
        },
    });

    const requestServiceIndex = request.requestServices.findIndex(
        (requestService) =>
        requestService.service.toString() === schedule.service.toString() &&
        requestService.availabilityPeriod.startTime.getTime() === schedule.availabilityPeriod.startTime.getTime() &&
        requestService.availabilityPeriod.endTime.getTime() === schedule.availabilityPeriod.endTime.getTime()
    );
    request.requestServices[requestServiceIndex].isFinishedProvided = true;
    request.requestServices[requestServiceIndex].finishedProvidedAt = Date.now();

    await request.save();

    res.status(200).json({
        success: true,
        message: "Schedule completed",
    });
});

// @desc    upload profile avatar/picture
// @route   PUT /api/v1/users/:id/avatar
// @access  private
const uploadProfileAvatar = asyncHandler(async(req, res, next) => {
    const user = req.document;

    if (!req.files) {
        return next(new ErrorResponse("Please upload a file", 400));
    }

    const file = req.files.files;

    // make sure that the image is a photo
    if (!file.mimetype.startsWith("image")) {
        return next(new ErrorResponse("Please upload an image file", 400));
    }

    // check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400));
    }

    // create custom filename
    file.name = `avatar_${user._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async(err) => {
        if (err) {
            console.log(err);
            return next(new ErrorResponse("Problem with file upload", 500));
        }

        await User.findByIdAndUpdate(req.params.id, { avatar: file.name });

        res.status(200).json({ success: true, data: file.name });
    });
});

export {
    getUsers,
    getUser,
    deleteUser,
    updateUser,
    getUserProfile,
    updateUserProfile,
    addSchedules,
    setScheduleCompleted,
    uploadProfileAvatar,
};