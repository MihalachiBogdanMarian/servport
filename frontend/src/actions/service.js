import {
    ADD_FILTER,
    CHANGE_PAGE_NUMBER,
    SERVICE_ADD_AVAILABILITY_PERIODS_FAIL,
    SERVICE_ADD_AVAILABILITY_PERIODS_REQUEST,
    SERVICE_ADD_AVAILABILITY_PERIODS_SUCCESS,
    SERVICE_ADD_PAYMENT_USERS_FAIL,
    SERVICE_ADD_PAYMENT_USERS_REQUEST,
    SERVICE_ADD_PAYMENT_USERS_SUCCESS,
    SERVICE_DELETE_FAIL,
    SERVICE_DELETE_REQUEST,
    SERVICE_DELETE_SUCCESS,
    SERVICE_GET_MY_SERVICES_FAIL,
    SERVICE_GET_MY_SERVICES_REQUEST,
    SERVICE_GET_MY_SERVICES_SUCCESS,
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
    SERVICE_GET_SERVICE_DETAILS_SUCCESS,
    SERVICE_GET_TOP_RATED_FAIL,
    SERVICE_GET_TOP_RATED_REQUEST,
    SERVICE_GET_TOP_RATED_SUCCESS,
    SERVICE_POST_FAIL,
    SERVICE_POST_REQUEST,
    SERVICE_POST_SUCCESS,
    SERVICE_REMOVE_AVAILABILITY_PERIODS_FAIL,
    SERVICE_REMOVE_AVAILABILITY_PERIODS_REQUEST,
    SERVICE_REMOVE_AVAILABILITY_PERIODS_SUCCESS,
    SERVICE_UPDATE_FAIL,
    SERVICE_UPDATE_REQUEST,
    SERVICE_UPDATE_SUCCESS,
    SERVICE_UPLOAD_IMAGES_FAIL,
    SERVICE_UPLOAD_IMAGES_REQUEST,
    SERVICE_UPLOAD_IMAGES_SUCCESS,
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
            payload: getErrorMessage(error, true),
        });
    }
};

export const getTopRatedServicesPerCategory = (category, number) => async(dispatch) => {
    try {
        dispatch({ type: SERVICE_GET_TOP_RATED_REQUEST });

        const { data } = await api.get(`/services/toprated/${category}/${number}`);

        dispatch({
            type: SERVICE_GET_TOP_RATED_SUCCESS,
            payload: data.data,
        });
    } catch (error) {
        dispatch({
            type: SERVICE_GET_TOP_RATED_FAIL,
            payload: getErrorMessage(error),
        });
    }
};

export const getMyServices = (pageNumber) => async(dispatch) => {
    try {
        dispatch({ type: SERVICE_GET_MY_SERVICES_REQUEST });

        const { data } = await api.get(`/services/myservices?page=${pageNumber}`);

        dispatch({
            type: SERVICE_GET_MY_SERVICES_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: SERVICE_GET_MY_SERVICES_FAIL,
            payload: getErrorMessage(error, true),
        });
    }
};

export const postServiceOffer =
    (title, description, category, price, availabilityPeriods, addresses) => async(dispatch) => {
        try {
            dispatch({ type: SERVICE_POST_REQUEST });

            const { data } = await api.post("/services", {
                title,
                description,
                category,
                price,
                availabilityPeriods,
                addresses,
            });

            dispatch({
                type: SERVICE_POST_SUCCESS,
                payload: data.data,
            });
        } catch (error) {
            dispatch({
                type: SERVICE_POST_FAIL,
                payload: getErrorMessage(error, true),
            });
        }
    };

export const updateService =
    (id, title, description, category, price, images, availabilityPeriods, addresses) => async(dispatch) => {
        try {
            dispatch({ type: SERVICE_UPDATE_REQUEST });

            const { data } = await api.put(`/services/${id}`, {
                title,
                description,
                category,
                price,
                images,
                availabilityPeriods,
                addresses,
            });

            dispatch({
                type: SERVICE_UPDATE_SUCCESS,
                payload: data.data,
            });
        } catch (error) {
            dispatch({
                type: SERVICE_UPDATE_FAIL,
                payload: getErrorMessage(error, true),
            });
        }
    };

export const deleteService = (id) => async(dispatch) => {
    try {
        dispatch({ type: SERVICE_DELETE_REQUEST });

        const { data } = await api.delete(`/services/${id}`);

        dispatch({
            type: SERVICE_DELETE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: SERVICE_DELETE_FAIL,
            payload: getErrorMessage(error, true),
        });
    }
};

export const addAvailabilityPeriods = (id, availabilityPeriods) => async(dispatch) => {
    try {
        dispatch({ type: SERVICE_ADD_AVAILABILITY_PERIODS_REQUEST });

        const { data } = await api.post(`/services/${id}/availabilityperiods`, { availabilityPeriods });

        dispatch({
            type: SERVICE_ADD_AVAILABILITY_PERIODS_SUCCESS,
            payload: data.data,
        });
    } catch (error) {
        dispatch({
            type: SERVICE_ADD_AVAILABILITY_PERIODS_FAIL,
            payload: getErrorMessage(error, true),
        });
    }
};

export const removeAvailabilityPeriods = (id, availabilityPeriodIds) => async(dispatch) => {
    try {
        dispatch({ type: SERVICE_REMOVE_AVAILABILITY_PERIODS_REQUEST });

        const { data } = await api.delete(`/services/${id}/availabilityperiods`);

        dispatch({
            type: SERVICE_REMOVE_AVAILABILITY_PERIODS_SUCCESS,
            payload: data.data,
        });
    } catch (error) {
        dispatch({
            type: SERVICE_REMOVE_AVAILABILITY_PERIODS_FAIL,
            payload: getErrorMessage(error, true),
        });
    }
};

export const addUsersToPayment = (id, phonesAndPrices, emailsAndPrices) => async(dispatch) => {
    try {
        dispatch({ type: SERVICE_ADD_PAYMENT_USERS_REQUEST });

        const { data } = await api.put(`/services/${id}/payment`);

        dispatch({
            type: SERVICE_ADD_PAYMENT_USERS_SUCCESS,
            payload: data.data,
        });
    } catch (error) {
        dispatch({
            type: SERVICE_ADD_PAYMENT_USERS_FAIL,
            payload: getErrorMessage(error, true),
        });
    }
};

export const uploadServiceImages = (id, files, setUploadPercentage) => async(dispatch) => {
    try {
        dispatch({ type: SERVICE_UPLOAD_IMAGES_REQUEST });

        const formData = new FormData();
        formData.append("files", files);

        const { data } = await api.put(`/services/${id}/images`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
                setUploadPercentage(parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total)));
            },
        });

        // clear progress bar percentage
        setTimeout(() => setUploadPercentage(0), 3000);

        dispatch({
            type: SERVICE_UPLOAD_IMAGES_SUCCESS,
            payload: data.data,
        });
    } catch (error) {
        dispatch({
            type: SERVICE_UPLOAD_IMAGES_FAIL,
            payload: getErrorMessage(error, true),
        });
        setUploadPercentage(0);
    }
};