import {
    SERVICE_ADD_REVIEW_FAIL,
    SERVICE_ADD_REVIEW_REQUEST,
    SERVICE_ADD_REVIEW_SUCCESS,
    SERVICE_GET_SERVICE_REVIEWS_FAIL,
    SERVICE_GET_SERVICE_REVIEWS_REQUEST,
    SERVICE_GET_SERVICE_REVIEWS_SUCCESS,
    SERVICE_REMOVE_REVIEW_FAIL,
    SERVICE_REMOVE_REVIEW_REQUEST,
    SERVICE_REMOVE_REVIEW_SUCCESS,
    SERVICE_STAR_REVIEW_FAIL,
    SERVICE_STAR_REVIEW_REQUEST,
    SERVICE_STAR_REVIEW_SUCCESS,
} from "../constants/review";
import api from "../utils/api";
import getErrorMessage from "../utils/getErrorMessage";

export const getServiceReviews = (id) => async(dispatch) => {
    try {
        dispatch({ type: SERVICE_GET_SERVICE_REVIEWS_REQUEST });

        const { data } = await api.get(`/services/${id}/reviews`);

        dispatch({
            type: SERVICE_GET_SERVICE_REVIEWS_SUCCESS,
            payload: data.data,
        });
    } catch (error) {
        dispatch({
            type: SERVICE_GET_SERVICE_REVIEWS_FAIL,
            payload: getErrorMessage(error),
        });
    }
};

export const addReview = (id, title, comment) => async(dispatch) => {
    try {
        dispatch({ type: SERVICE_ADD_REVIEW_REQUEST });

        const { data } = await api.post(`/services/${id}/reviews`, { title, comment });

        dispatch({
            type: SERVICE_ADD_REVIEW_SUCCESS,
            payload: data,
        });
        const newReviewId = data.review._id.toString();

        const { data: starReviewData } = await api.put(`/services/${id}/reviews/${newReviewId}/stars`);

        dispatch({
            type: SERVICE_STAR_REVIEW_SUCCESS,
            payload: starReviewData,
        });
    } catch (error) {
        dispatch({
            type: SERVICE_ADD_REVIEW_FAIL,
            payload: getErrorMessage(error, true),
        });
    }
};

export const starReview = (serviceId, reviewId) => async(dispatch) => {
    try {
        dispatch({ type: SERVICE_STAR_REVIEW_REQUEST });

        const { data } = await api.delete(`/services/${serviceId}/reviews/${reviewId}/stars`);

        dispatch({
            type: SERVICE_STAR_REVIEW_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: SERVICE_STAR_REVIEW_FAIL,
            payload: getErrorMessage(error, true),
        });
    }
};

export const removeReview = (serviceId, reviewId) => async(dispatch) => {
    try {
        dispatch({ type: SERVICE_REMOVE_REVIEW_REQUEST });

        const { data } = await api.delete(`/services/${serviceId}/reviews/${reviewId}`);

        dispatch({
            type: SERVICE_REMOVE_REVIEW_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: SERVICE_REMOVE_REVIEW_FAIL,
            payload: getErrorMessage(error, true),
        });
    }
};