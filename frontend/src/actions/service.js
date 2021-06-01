import {
    SERVICE_GET_SERVICES_FAIL,
    SERVICE_GET_SERVICES_REQUEST,
    SERVICE_GET_SERVICES_SUCCESS,
} from "../constants/service";
import api from "../utils/api";

export const getServices = (category, pageNumber, filters) => async(dispatch) => {
    try {
        dispatch({ type: SERVICE_GET_SERVICES_REQUEST });

        let filtersString = "";
        if (filters && filters.length) {
            filtersString = "&" + filters.join("&");
        }

        const { data } = await api.get(`/services?page=${pageNumber}&category=${category}${filtersString}`);

        dispatch({
            type: SERVICE_GET_SERVICES_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const message =
            error.response && error.response.data.errorMessage ? error.response.data.errorMessage : error.message;
        dispatch({
            type: SERVICE_GET_SERVICES_FAIL,
            payload: message,
        });
    }
};