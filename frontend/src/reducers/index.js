import { combineReducers } from "redux";
import { getMe, login, register } from "./auth";
import { request } from "./request";
import { addReview, getServiceReviews, removeReview } from "./review";
import { getPageAndFilters, getServiceDetails, getServices, getTopRatedServicesPerCategory } from "./service";

export default combineReducers({
    loggedInUser: getMe,
    loginData: login,
    registerData: register,
    request,
    servicesList: getServices,
    pageAndFilters: getPageAndFilters,
    serviceDetails: getServiceDetails,
    serviceReviews: getServiceReviews,
    // pricePercentage: getPricePercentage,
    addReviewStatus: addReview,
    removeReviewStatus: removeReview,
    topRatedServices: getTopRatedServicesPerCategory,
});