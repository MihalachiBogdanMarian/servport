import { combineReducers } from "redux";
import { getMe, login, register } from "./auth";
import { request } from "./request";
import { getPageAndFilters, getPricePercentage, getServiceDetails, getServices } from "./service";

export default combineReducers({
    loggedInUser: getMe,
    loginData: login,
    registerData: register,
    request,
    servicesList: getServices,
    pageAndFilters: getPageAndFilters,
    serviceDetails: getServiceDetails,
    pricePercentage: getPricePercentage,
});