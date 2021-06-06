import {
    ADD_FILTER,
    CHANGE_PAGE_NUMBER,
    SERVICE_GET_PRICE_PERCENTAGE_FAIL,
    SERVICE_GET_PRICE_PERCENTAGE_REQUEST,
    SERVICE_GET_PRICE_PERCENTAGE_SUCCESS,
    SERVICE_GET_SERVICES_BY_DESCRIPTION_FAIL,
    SERVICE_GET_SERVICES_BY_DESCRIPTION_REQUEST,
    SERVICE_GET_SERVICES_BY_DESCRIPTION_SUCCESS,
    SERVICE_GET_SERVICES_FAIL,
    SERVICE_GET_SERVICES_IN_DISTANCE_RADIUS_FAIL,
    SERVICE_GET_SERVICES_IN_DISTANCE_RADIUS_REQUEST,
    SERVICE_GET_SERVICES_IN_DISTANCE_RADIUS_SUCCESS,
    SERVICE_GET_SERVICES_REQUEST,
    SERVICE_GET_SERVICES_SUCCESS,
    SERVICE_GET_SERVICE_DETAILS_FAIL,
    SERVICE_GET_SERVICE_DETAILS_REQUEST,
    SERVICE_GET_SERVICE_DETAILS_SUCCESS
} from "../constants/service";
import store from "../store";
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

        const { data } = await api.get(`/services/textsearch/${description}`);

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

        const { data } = await api.get(`/services/distanceradius/${address}/${distance}`);

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

export const addFilter =
    (filter, address = "", kmOption = {}, text = "") =>
    (dispatch) => {
        let newFilters = [...store.getState().pageAndFilters.filters];
        if (filter.startsWith("geoSearch=")) {
            const filterApplied = newFilters.findIndex((newFilter) => newFilter.startsWith("geoSearch="));
            if (filterApplied !== -1) {
                newFilters = [
                    ...newFilters.filter(
                        (newFilter) => !(newFilter.startsWith("geoSearchAddress=") || newFilter.startsWith("geoSearchKm="))
                    ),
                    "geoSearchAddress=" + address,
                    "geoSearchKm=" + kmOption.value,
                ];
            } else {
                newFilters = [...newFilters, "geoSearch=1", "geoSearchAddress=" + address, "geoSearchKm=" + kmOption.value];
            }
        } else if (filter.startsWith("textSearch=")) {
            const filterApplied = newFilters.findIndex((newFilter) => newFilter.startsWith("textSearch="));
            if (filterApplied !== -1) {
                newFilters = [
                    ...newFilters.filter((newFilter) => !newFilter.startsWith("textSearchDescription=")),
                    "textSearchDescription=" + text,
                ];
            } else {
                newFilters = [...newFilters, "textSearch=1", "textSearchDescription=" + text];
            }
        } else {
            const filterApplied = newFilters.findIndex((newFilter) => newFilter.startsWith(filter.split("=")[0] + "="));
            if (filterApplied !== -1) {
                newFilters = [...newFilters.filter((newFilter) => !newFilter.startsWith(filter.split("=")[0] + "=")), filter];
            } else {
                newFilters = [...newFilters, filter];
            }
        }
        dispatch({ type: ADD_FILTER, payload: newFilters });
    };

export const changePageNumber = (pageNumber) => (dispatch) => {
    dispatch({ type: CHANGE_PAGE_NUMBER, payload: pageNumber });
};

export const getServiceDetails = (id) => async(dispatch) => {
    try {
        dispatch({ type: SERVICE_GET_SERVICE_DETAILS_REQUEST });

        const { data } = await api.get(`/services/${id}`);

        dispatch({
            type: SERVICE_GET_SERVICE_DETAILS_SUCCESS,
            payload: data.data,
        });
    } catch (error) {
        dispatch({
            type: SERVICE_GET_SERVICE_DETAILS_FAIL,
            payload: getErrorMessage(error),
        });
    }
};

export const getPricePercentage = (id) => async(dispatch) => {
    try {
        dispatch({ type: SERVICE_GET_PRICE_PERCENTAGE_REQUEST });

        const { data } = await api.get(`/services/${id}/percentage`);

        dispatch({
            type: SERVICE_GET_PRICE_PERCENTAGE_SUCCESS,
            payload: data.data,
        });
    } catch (error) {
        dispatch({
            type: SERVICE_GET_PRICE_PERCENTAGE_FAIL,
            payload: getErrorMessage(error),
        });
    }
};