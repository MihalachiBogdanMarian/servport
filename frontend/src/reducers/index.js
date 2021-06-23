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
    postServiceOffer,
} from "./service";
import { setScheduleCompleted, updateProfileInfo, uploadProfilePicture } from "./user";

export default combineReducers({
    loggedInUser: getMe,
    loginData: login,
    registerData: register,
    changePasswordData: changePassword,
    forgotPasswordStatus: forgotPassword,
    resetPasswordStatus: resetPassword,
    uploadProfilePictureStatus: uploadProfilePicture,
    updateProfileInfoStatus: updateProfileInfo,
    setScheduleCompletedStatus: setScheduleCompleted,
    request,
    servicesList: getServices,
    myServices: getMyServices,
    postedService: postServiceOffer,
    pageAndFilters: getPageAndFilters,
    serviceDetails: getServiceDetails,
    serviceReviews: getServiceReviews,
    // pricePercentage: getPricePercentage,
    addReviewStatus: addReview,
    removeReviewStatus: removeReview,
    topRatedServices: getTopRatedServicesPerCategory,
});