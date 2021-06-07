import {
    AUTH_GET_ME_FAIL,
    AUTH_GET_ME_REQUEST,
    AUTH_GET_ME_SUCCESS,
    AUTH_LOGIN_FAIL,
    AUTH_LOGIN_REQUEST,
    AUTH_LOGIN_SUCCESS,
    AUTH_REGISTER_FAIL,
    AUTH_REGISTER_REQUEST,
    AUTH_REGISTER_SUCCESS,
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
            payload: getErrorMessage(error, true),
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
            payload: getErrorMessage(error, true),
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
            payload: getErrorMessage(error),
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