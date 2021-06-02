import {
    SERVICE_GET_SERVICES_BY_DESCRIPTION_FAIL,
    SERVICE_GET_SERVICES_BY_DESCRIPTION_REQUEST,
    SERVICE_GET_SERVICES_BY_DESCRIPTION_SUCCESS,
    SERVICE_GET_SERVICES_FAIL,
    SERVICE_GET_SERVICES_IN_DISTANCE_RADIUS_FAIL,
    SERVICE_GET_SERVICES_IN_DISTANCE_RADIUS_REQUEST,
    SERVICE_GET_SERVICES_IN_DISTANCE_RADIUS_SUCCESS,
    SERVICE_GET_SERVICES_REQUEST,
    SERVICE_GET_SERVICES_SUCCESS,
} from "../constants/service";
import api from "../utils/api";
import getErrorMessage from "../utils/getErrorMessage";

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
        dispatch({
            type: SERVICE_GET_SERVICES_FAIL,
            payload: getErrorMessage(error),
        });
    }
};

export const getServicesByDescription = (description) => async(dispatch) => {
    try {
        dispatch({ type: SERVICE_GET_SERVICES_BY_DESCRIPTION_REQUEST });

        const { data } = await api.get(`/api/v1/services/textsearch/${description}`);

        dispatch({
            type: SERVICE_GET_SERVICES_BY_DESCRIPTION_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: SERVICE_GET_SERVICES_BY_DESCRIPTION_FAIL,
            payload: getErrorMessage(error),
        });
    }
};

export const getServicesInDistanceRadius = (address, distance) => async(dispatch) => {
    try {
        dispatch({ type: SERVICE_GET_SERVICES_IN_DISTANCE_RADIUS_REQUEST });

        const { data } = await api.get(`/api/v1/services/distanceradius/${address}/${distance}`);

        dispatch({
            type: SERVICE_GET_SERVICES_IN_DISTANCE_RADIUS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: SERVICE_GET_SERVICES_IN_DISTANCE_RADIUS_FAIL,
            payload: getErrorMessage(error),
        });
    }
};