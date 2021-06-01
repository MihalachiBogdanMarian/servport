import { combineReducers } from "redux";
import { getMe, login, register } from "./auth";
import { request } from "./request";
import { getServices } from "./service";

export default combineReducers({
    loggedInUser: getMe,
    loginData: login,
    registerData: register,
    request,
    servicesList: getServices,
});