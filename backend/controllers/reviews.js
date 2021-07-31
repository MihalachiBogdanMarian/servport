import asyncHandler from "../middleware/async.js";
import ErrorResponse from "../utils/errorResponse.js";
import sentimentAnalysis from "../utils/sentimentAnalysis.js";

// @desc    get reviews for a service
// @route   GET /api/v1/services/:serviceId/reviews
// @access  private
const getReviews = asyncHandler(async(req, res, next) => {
    res.status(200).json({
        success: true,
        data: req.document.reviews,
    });
});

// @desc    add review to service
// @route   POST /api/v1/services/:serviceId/reviews
// @access  private
const addReview = asyncHandler(async(req, res, next) => {
    const { title, comment } = req.body;

    let service = req.document;

    const myServiceOffer = service.user.toString() === req.user._id.toString();

    if (myServiceOffer) {
        return next(new ErrorResponse("Cannot post review to your own service offer", 400));
    }

    const alreadyReviewed = service.reviews.find((review) => review.user._id.toString() === req.user._id.toString());

    if (alreadyReviewed) {
        return next(new ErrorResponse("Service already reviewed", 400));
    }

    /* SENTIMENT ANALYSIS COMPONENT */
    // const sentiment = await sentimentAnalysis(comment, next);
    // let stars;
    // switch (sentiment) {
    //     case "Poor":
    //         stars = 1;
    //         break;
    //     case "Fair":
    //         stars = 2;
    //         break;
    //     case "Good":
    //         stars = 3;
    //         break;
    //     case "Very Good":
    //         stars = 4;
    //         break;
    //     case "Excellent":
    //         stars = 5;
    //         break;
    //     default:
    //         break;
    // }

    const review = {
        title,
        // rating: stars,
        comment,
        user: req.user._id,
    };

    service.reviews.unshift(review);

    await service.save();

    const newReview = service.reviews.find((review) => review.user.toString() === req.user._id.toString());

    res.status(201).json({ success: true, review: newReview, message: "Review added" });
});

// @desc    remove review from service
// @route   DEL /api/v1/services/:serviceId/reviews/:reviewId
// @access  private
const removeReview = asyncHandler(async(req, res, next) => {
    let service = req.document;

    const review = service.reviews.find((review) => review._id.toString() === req.params.reviewId);

    if (!review) {
        return next(new ErrorResponse(`No review with the id of ${req.params.reviewId}`, 404));
    }

    const myReview = review.user._id.toString() === req.user._id.toString();

    if (!myReview) {
        return next(new ErrorResponse("Cannot delete someone elses review", 400));
    }

    service.reviews = service.reviews.filter((review) => review._id != req.params.reviewId);

    await service.save();

    res.status(200).json({
        success: true,
        message: "Review deleted",
    });
});

// @desc    get stars for review based on comment
// @route   PUT /api/v1/services/:serviceId/reviews/:reviewId/stars
// @access  private
const starReview = asyncHandler(async(req, res, next) => {
    let service = req.document;

    const review = service.reviews.find((review) => review._id.toString() === req.params.reviewId);

    if (!review) {
        return next(new ErrorResponse(`No review with the id of ${req.params.reviewId}`, 404));
    }

    const myReview = review.user._id.toString() === req.user._id.toString();

    if (!myReview) {
        return next(new ErrorResponse("Cannot star someone elses review", 400));
    }

    const sentiment = await sentimentAnalysis(review.comment, next);

    let stars;
    switch (sentiment) {
        case "Poor":
            stars = 1;
            break;
        case "Fair":
            stars = 2;
            break;
        case "Good":
            stars = 3;
            break;
        case "Very Good":
            stars = 4;
            break;
        case "Excellent":
            stars = 5;
            break;
        default:
            break;
    }

    service.reviews[service.reviews.findIndex((review) => review._id.toString() === req.params.reviewId)].rating = stars;

    await service.save();

    res.status(201).json({ success: true, sentiment, stars, review, message: "Review starred" });
});

export { getReviews, addReview, removeReview, starReview };