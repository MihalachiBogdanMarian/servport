import {
    SERVICE_GET_SERVICES_FAIL,
    SERVICE_GET_SERVICES_REQUEST,
    SERVICE_GET_SERVICES_RESET,
    SERVICE_GET_SERVICES_SUCCESS,
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
            return { services: {} };
        default:
            return state;
    }
};