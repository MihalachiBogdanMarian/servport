import {
    AUTH_CHANGE_PASSWORD_FAIL,
    AUTH_CHANGE_PASSWORD_REQUEST,
    AUTH_CHANGE_PASSWORD_RESET,
    AUTH_CHANGE_PASSWORD_SUCCESS,
    AUTH_FORGOT_PASSWORD_FAIL,
    AUTH_FORGOT_PASSWORD_REQUEST,
    AUTH_FORGOT_PASSWORD_RESET,
    AUTH_FORGOT_PASSWORD_SUCCESS,
    AUTH_GET_ME_FAIL,
    AUTH_GET_ME_REQUEST,
    AUTH_GET_ME_RESET,
    AUTH_GET_ME_SUCCESS,
    AUTH_LOGIN_FAIL,
    AUTH_LOGIN_REQUEST,
    AUTH_LOGIN_SUCCESS,
    AUTH_LOGOUT,
    AUTH_REGISTER_FAIL,
    AUTH_REGISTER_REQUEST,
    AUTH_REGISTER_RESET,
    AUTH_REGISTER_SUCCESS,
    AUTH_RESET_PASSWORD_FAIL,
    AUTH_RESET_PASSWORD_REQUEST,
    AUTH_RESET_PASSWORD_RESET,
    AUTH_RESET_PASSWORD_SUCCESS,
} from "../constants/auth";

export const login = (state = { token: null, isAuthenticated: false }, action) => {
    switch (action.type) {
        case AUTH_LOGIN_REQUEST:
            return {...state, loading: true };
        case AUTH_LOGIN_SUCCESS:
            return { loading: false, token: action.payload, isAuthenticated: true };
        case AUTH_LOGIN_FAIL:
            return { loading: false, error: action.payload, isAuthenticated: false };
        case AUTH_LOGOUT:
            return { token: null, isAuthenticated: false };
        default:
            return state;
    }
};

export const register = (state = { token: null, isAuthenticated: false }, action) => {
    switch (action.type) {
        case AUTH_REGISTER_REQUEST:
            return {...state, loading: true };
        case AUTH_REGISTER_SUCCESS:
            return { loading: false, token: action.payload, isAuthenticated: true };
        case AUTH_REGISTER_FAIL:
            return { loading: false, error: action.payload, isAuthenticated: false };
        case AUTH_REGISTER_RESET:
            return { token: null, isAuthenticated: false };
        default:
            return state;
    }
};

export const getMe = (state = { userDetails: {} }, action) => {
    switch (action.type) {
        case AUTH_GET_ME_REQUEST:
            return {...state, loading: true };
        case AUTH_GET_ME_SUCCESS:
            return { loading: false, userDetails: action.payload };
        case AUTH_GET_ME_FAIL:
            return { loading: false, error: action.payload };
        case AUTH_GET_ME_RESET:
            return { userDetails: {} };
        default:
            return state;
    }
};

export const changePassword = (state = { token: null, isAuthenticated: false }, action) => {
    switch (action.type) {
        case AUTH_CHANGE_PASSWORD_REQUEST:
            return {...state, loading: true };
        case AUTH_CHANGE_PASSWORD_SUCCESS:
            return { loading: false, token: action.payload, isAuthenticated: true };
        case AUTH_CHANGE_PASSWORD_FAIL:
            return { loading: false, error: action.payload, isAuthenticated: false };
        case AUTH_CHANGE_PASSWORD_RESET:
            return { token: null, isAuthenticated: false };
        default:
            return state;
    }
};

export const forgotPassword = (state = { success: false, message: "" }, action) => {
    switch (action.type) {
        case AUTH_FORGOT_PASSWORD_REQUEST:
            return {...state, loading: true };
        case AUTH_FORGOT_PASSWORD_SUCCESS:
            return { loading: false, success: action.payload.success, message: action.payload.message };
        case AUTH_FORGOT_PASSWORD_FAIL:
            return { loading: false, success: false, error: action.payload };
        case AUTH_FORGOT_PASSWORD_RESET:
            return { success: false, message: "" };
        default:
            return state;
    }
};

export const resetPassword = (state = { success: false, message: "" }, action) => {
    switch (action.type) {
        case AUTH_RESET_PASSWORD_REQUEST:
            return {...state, loading: true };
        case AUTH_RESET_PASSWORD_SUCCESS:
            return { loading: false, success: action.payload.success, message: action.payload.message };
        case AUTH_RESET_PASSWORD_FAIL:
            return { loading: false, success: false, error: action.payload };
        case AUTH_RESET_PASSWORD_RESET:
            return { success: false, message: "" };
        default:
            return state;
    }
};