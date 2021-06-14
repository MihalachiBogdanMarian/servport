import {
    AUTH_CHANGE_PASSWORD_FAIL,
    AUTH_CHANGE_PASSWORD_REQUEST,
    AUTH_CHANGE_PASSWORD_SUCCESS,
    AUTH_FORGOT_PASSWORD_FAIL,
    AUTH_FORGOT_PASSWORD_REQUEST,
    AUTH_FORGOT_PASSWORD_SUCCESS,
    AUTH_GET_ME_FAIL,
    AUTH_GET_ME_REQUEST,
    AUTH_GET_ME_SUCCESS,
    AUTH_LOGIN_FAIL,
    AUTH_LOGIN_REQUEST,
    AUTH_LOGIN_SUCCESS,
    AUTH_REGISTER_FAIL,
    AUTH_REGISTER_REQUEST,
    AUTH_REGISTER_SUCCESS,
    AUTH_RESET_PASSWORD_FAIL,
    AUTH_RESET_PASSWORD_REQUEST,
    AUTH_RESET_PASSWORD_SUCCESS,
} from "../constants/auth";
import api from "../utils/api";
import getErrorMessage from "../utils/getErrorMessage";

export const login = (email, password) => async(dispatch) => {
    try {
        const body = { email, password };

        dispatch({ type: AUTH_LOGIN_REQUEST });

        const { data } = await api.post("/auth/login", body);

        dispatch({
            type: AUTH_LOGIN_SUCCESS,
            payload: data.token,
        });

        dispatch(getMe());
    } catch (error) {
        dispatch({
            type: AUTH_LOGIN_FAIL,
            payload: getErrorMessage(error),
        });
    }
};

export const register = (name, email, phone, password, address) => async(dispatch) => {
    try {
        dispatch({ type: AUTH_REGISTER_REQUEST });

        const { data } = await api.post("/auth/register", { name, email, phone, password, address });

        dispatch({
            type: AUTH_REGISTER_SUCCESS,
            payload: data.token,
        });

        dispatch({
            type: AUTH_LOGIN_SUCCESS,
            payload: data.token,
        });

        dispatch(getMe());
    } catch (error) {
        dispatch({
            type: AUTH_REGISTER_FAIL,
            payload: getErrorMessage(error),
        });
    }
};

export const getMe = () => async(dispatch) => {
    try {
        dispatch({ type: AUTH_GET_ME_REQUEST });

        const { data } = await api.get("/auth/me");

        dispatch({
            type: AUTH_GET_ME_SUCCESS,
            payload: data.data,
        });
    } catch (error) {
        dispatch({
            type: AUTH_GET_ME_FAIL,
            payload: getErrorMessage(error, true),
        });
    }
};

export const logout = () => async(dispatch) => {
    localStorage.removeItem("token");
    localStorage.removeItem("userDetails");
    localStorage.removeItem("requestServices");
    localStorage.removeItem("executionAddresses");
    localStorage.removeItem("paymentMethod");
    const newLocation = document.location.href;
    document.location.href = newLocation;
};

export const changePassword = (currentPassword, newPassword) => async(dispatch) => {
    try {
        dispatch({ type: AUTH_CHANGE_PASSWORD_REQUEST });

        const { data } = await api.put("/auth/updatepassword", { currentPassword, newPassword });

        dispatch({
            type: AUTH_CHANGE_PASSWORD_SUCCESS,
            payload: data.token,
        });
    } catch (error) {
        dispatch({
            type: AUTH_CHANGE_PASSWORD_FAIL,
            payload: getErrorMessage(error, true),
        });
    }
};

export const forgotPassword = (email) => async(dispatch) => {
    try {
        dispatch({ type: AUTH_FORGOT_PASSWORD_REQUEST });

        const { data } = await api.post("/auth/forgotpassword", { email });

        dispatch({
            type: AUTH_FORGOT_PASSWORD_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: AUTH_FORGOT_PASSWORD_FAIL,
            payload: getErrorMessage(error, true),
        });
    }
};

export const resetPassword = (newPassword, resetToken) => async(dispatch) => {
    try {
        dispatch({ type: AUTH_RESET_PASSWORD_REQUEST });

        const { data } = await api.put(`/auth/resetpassword/${resetToken}`, { newPassword });

        dispatch({
            type: AUTH_RESET_PASSWORD_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: AUTH_RESET_PASSWORD_FAIL,
            payload: getErrorMessage(error, true),
        });
    }
};