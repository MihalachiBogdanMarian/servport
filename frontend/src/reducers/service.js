import {
    ADD_FILTER,
    CHANGE_PAGE_NUMBER,
    RESET_PAGE_AND_FILTERS,
    SERVICE_GET_MY_SERVICES_FAIL,
    SERVICE_GET_MY_SERVICES_REQUEST,
    SERVICE_GET_MY_SERVICES_RESET,
    SERVICE_GET_MY_SERVICES_SUCCESS,
    SERVICE_GET_PRICE_PERCENTAGE_FAIL,
    SERVICE_GET_PRICE_PERCENTAGE_REQUEST,
    SERVICE_GET_PRICE_PERCENTAGE_RESET,
    SERVICE_GET_PRICE_PERCENTAGE_SUCCESS,
    SERVICE_GET_SERVICES_BY_DESCRIPTION_FAIL,
    SERVICE_GET_SERVICES_BY_DESCRIPTION_REQUEST,
    SERVICE_GET_SERVICES_BY_DESCRIPTION_RESET,
    SERVICE_GET_SERVICES_BY_DESCRIPTION_SUCCESS,
    SERVICE_GET_SERVICES_FAIL,
    SERVICE_GET_SERVICES_IN_DISTANCE_RADIUS_FAIL,
    SERVICE_GET_SERVICES_IN_DISTANCE_RADIUS_REQUEST,
    SERVICE_GET_SERVICES_IN_DISTANCE_RADIUS_RESET,
    SERVICE_GET_SERVICES_IN_DISTANCE_RADIUS_SUCCESS,
    SERVICE_GET_SERVICES_REQUEST,
    SERVICE_GET_SERVICES_RESET,
    SERVICE_GET_SERVICES_SUCCESS,
    SERVICE_GET_SERVICE_DETAILS_FAIL,
    SERVICE_GET_SERVICE_DETAILS_REQUEST,
    SERVICE_GET_SERVICE_DETAILS_RESET,
    SERVICE_GET_SERVICE_DETAILS_SUCCESS,
    SERVICE_GET_TOP_RATED_FAIL,
    SERVICE_GET_TOP_RATED_REQUEST,
    SERVICE_GET_TOP_RATED_RESET,
    SERVICE_GET_TOP_RATED_SUCCESS,
    SERVICE_POST_FAIL,
    SERVICE_POST_REQUEST,
    SERVICE_POST_RESET,
    SERVICE_POST_SUCCESS,
} from "../constants/service";

export const getServices = (state = { services: [] }, action) => {
    switch (action.type) {
        case SERVICE_GET_SERVICES_REQUEST:
            return {...state, loading: true };
        case SERVICE_GET_SERVICES_SUCCESS:
            return {
                loading: false,
                services: action.payload.data,
                pages: action.payload.pagination.pages,
                page: action.payload.pagination.page,
            };
        case SERVICE_GET_SERVICES_FAIL:
            return { loading: false, error: action.payload };
        case SERVICE_GET_SERVICES_RESET:
            return { services: [] };
        default:
            return state;
    }
};

export const getServicesByDescription = (state = { services: [] }, action) => {
    switch (action.type) {
        case SERVICE_GET_SERVICES_BY_DESCRIPTION_REQUEST:
            return {...state, loading: true };
        case SERVICE_GET_SERVICES_BY_DESCRIPTION_SUCCESS:
            return {
                loading: false,
                services: action.payload.data,
                pages: action.payload.pagination.pages,
                page: action.payload.pagination.page,
            };
        case SERVICE_GET_SERVICES_BY_DESCRIPTION_FAIL:
            return { loading: false, error: action.payload };
        case SERVICE_GET_SERVICES_BY_DESCRIPTION_RESET:
            return { services: [] };
        default:
            return state;
    }
};

export const getServicesInDistanceRadius = (state = { services: [] }, action) => {
    switch (action.type) {
        case SERVICE_GET_SERVICES_IN_DISTANCE_RADIUS_REQUEST:
            return {...state, loading: true };
        case SERVICE_GET_SERVICES_IN_DISTANCE_RADIUS_SUCCESS:
            return {
                loading: false,
                services: action.payload.data,
                pages: action.payload.pagination.pages,
                page: action.payload.pagination.page,
            };
        case SERVICE_GET_SERVICES_IN_DISTANCE_RADIUS_FAIL:
            return { loading: false, error: action.payload };
        case SERVICE_GET_SERVICES_IN_DISTANCE_RADIUS_RESET:
            return { services: [] };
        default:
            return state;
    }
};

export const getPageAndFilters = (state = { pageNumber: 1, filters: [] }, action) => {
    switch (action.type) {
        case ADD_FILTER:
            return {...state, filters: action.payload };
        case CHANGE_PAGE_NUMBER:
            return {...state, pageNumber: action.payload };
        case RESET_PAGE_AND_FILTERS:
            return { pageNumber: 1, filters: [] };
        default:
            return state;
    }
};

export const getServiceDetails = (state = { currentService: { reviews: [] }, percentage: null }, action) => {
    switch (action.type) {
        case SERVICE_GET_SERVICE_DETAILS_REQUEST:
            return {...state, loading: true };
        case SERVICE_GET_SERVICE_DETAILS_SUCCESS:
            return { loading: false, currentService: action.payload.service, percentage: action.payload.pricePercentage };
        case SERVICE_GET_SERVICE_DETAILS_FAIL:
            return { loading: false, error: action.payload };
        case SERVICE_GET_SERVICE_DETAILS_RESET:
            return { currentService: { reviews: [] }, percentage: null };
        default:
            return state;
    }
};

export const getPricePercentage = (state = { percentage: null }, action) => {
    switch (action.type) {
        case SERVICE_GET_PRICE_PERCENTAGE_REQUEST:
            return {...state, loading: true };
        case SERVICE_GET_PRICE_PERCENTAGE_SUCCESS:
            return { loading: false, percentage: action.payload };
        case SERVICE_GET_PRICE_PERCENTAGE_FAIL:
            return { loading: false, error: action.payload };
        case SERVICE_GET_PRICE_PERCENTAGE_RESET:
            return { percentage: null };
        default:
            return state;
    }
};

export const getTopRatedServicesPerCategory = (state = { topRatedServices: [] }, action) => {
    switch (action.type) {
        case SERVICE_GET_TOP_RATED_REQUEST:
            return {...state, loading: true };
        case SERVICE_GET_TOP_RATED_SUCCESS:
            return { loading: false, topRatedServices: action.payload };
        case SERVICE_GET_TOP_RATED_FAIL:
            return { loading: false, error: action.payload };
        case SERVICE_GET_TOP_RATED_RESET:
            return { topRatedServices: [] };
        default:
            return state;
    }
};

export const getMyServices = (state = { services: [] }, action) => {
    switch (action.type) {
        case SERVICE_GET_MY_SERVICES_REQUEST:
            return {...state, loading: true };
        case SERVICE_GET_MY_SERVICES_SUCCESS:
            return {
                loading: false,
                services: action.payload.data,
                pages: action.payload.pagination.pages,
                page: action.payload.pagination.page,
            };
        case SERVICE_GET_MY_SERVICES_FAIL:
            return { loading: false, error: action.payload };
        case SERVICE_GET_MY_SERVICES_RESET:
            return { services: [] };
        default:
            return state;
    }
};

export const postServiceOffer = (state = { service: {}, success: false, message: "" }, action) => {
    switch (action.type) {
        case SERVICE_POST_REQUEST:
            return {...state, loading: true };
        case SERVICE_POST_SUCCESS:
            return {
                loading: false,
                service: action.payload,
                success: true,
                message: "Service offer posted successfully",
            };
        case SERVICE_POST_FAIL:
            return { loading: false, success: false, error: action.payload };
        case SERVICE_POST_RESET:
            return { service: {}, success: false, message: "" };
        default:
            return state;
    }
};