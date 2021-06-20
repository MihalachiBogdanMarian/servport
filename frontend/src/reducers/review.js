import {
    SERVICE_ADD_REVIEW_FAIL,
    SERVICE_ADD_REVIEW_REQUEST,
    SERVICE_ADD_REVIEW_RESET,
    SERVICE_ADD_REVIEW_SUCCESS,
    SERVICE_GET_SERVICE_REVIEWS_FAIL,
    SERVICE_GET_SERVICE_REVIEWS_REQUEST,
    SERVICE_GET_SERVICE_REVIEWS_RESET,
    SERVICE_GET_SERVICE_REVIEWS_SUCCESS,
    SERVICE_REMOVE_REVIEW_FAIL,
    SERVICE_REMOVE_REVIEW_REQUEST,
    SERVICE_REMOVE_REVIEW_RESET,
    SERVICE_REMOVE_REVIEW_SUCCESS,
    SERVICE_STAR_REVIEW_SUCCESS,
} from "../constants/review";

export const getServiceReviews = (state = { currentServiceReviews: [] }, action) => {
    switch (action.type) {
        case SERVICE_GET_SERVICE_REVIEWS_REQUEST:
            return {...state, loading: true };
        case SERVICE_GET_SERVICE_REVIEWS_SUCCESS:
            return { loading: false, currentServiceReviews: action.payload };
        case SERVICE_GET_SERVICE_REVIEWS_FAIL:
            return { loading: false, error: action.payload };
        case SERVICE_GET_SERVICE_REVIEWS_RESET:
            return { currentServiceReviews: [] };
        default:
            return state;
    }
};

export const addReview = (state = { success: false, message: "", stars: null }, action) => {
    switch (action.type) {
        case SERVICE_ADD_REVIEW_REQUEST:
            return {...state, loading: true };
        case SERVICE_ADD_REVIEW_SUCCESS:
            return {
                loading: false,
                success: action.payload.success,
                message: action.payload.message,
            };
        case SERVICE_STAR_REVIEW_SUCCESS:
            return {
                loading: false,
                success: action.payload.success,
                message: action.payload.message,
                stars: action.payload.stars,
            };
        case SERVICE_ADD_REVIEW_FAIL:
            return { loading: false, success: false, error: action.payload };
        case SERVICE_ADD_REVIEW_RESET:
            return { success: false, message: "" };
        default:
            return state;
    }
};

export const removeReview = (state = { success: false, message: "" }, action) => {
    switch (action.type) {
        case SERVICE_REMOVE_REVIEW_REQUEST:
            return {...state, loading: true };
        case SERVICE_REMOVE_REVIEW_SUCCESS:
            return {
                loading: false,
                success: action.payload.success,
                message: action.payload.message,
            };
        case SERVICE_REMOVE_REVIEW_FAIL:
            return { loading: false, success: false, error: action.payload };
        case SERVICE_REMOVE_REVIEW_RESET:
            return { success: false, message: "" };
        default:
            return state;
    }
};