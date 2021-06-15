import { combineReducers } from "redux";
import { changePassword, forgotPassword, getMe, login, register, resetPassword } from "./auth";
import { request } from "./request";
import { addReview, getServiceReviews, removeReview } from "./review";
import {
    getMyServices,
    getPageAndFilters,
    getServiceDetails,
    getServices,
    getTopRatedServicesPerCategory,
} from "./service";
import { updateProfileInfo, uploadProfilePicture } from "./user";

export default combineReducers({
    loggedInUser: getMe,
    loginData: login,
    registerData: register,
    changePasswordData: changePassword,
    forgotPasswordStatus: forgotPassword,
    resetPasswordStatus: resetPassword,
    uploadProfilePictureStatus: uploadProfilePicture,
    updateProfileInfoStatus: updateProfileInfo,
    request,
    servicesList: getServices,
    myServices: getMyServices,
    pageAndFilters: getPageAndFilters,
    serviceDetails: getServiceDetails,
    serviceReviews: getServiceReviews,
    // pricePercentage: getPricePercentage,
    addReviewStatus: addReview,
    removeReviewStatus: removeReview,
    topRatedServices: getTopRatedServicesPerCategory,
});