import {
    USER_SET_SCHEDULE_COMPLETED_FAIL,
    USER_SET_SCHEDULE_COMPLETED_REQUEST,
    USER_SET_SCHEDULE_COMPLETED_SUCCESS,
    USER_UPDATE_PROFILE_INFO_FAIL,
    USER_UPDATE_PROFILE_INFO_REQUEST,
    USER_UPDATE_PROFILE_INFO_SUCCESS,
    USER_UPLOAD_PROFILE_PICTURE_FAIL,
    USER_UPLOAD_PROFILE_PICTURE_REQUEST,
    USER_UPLOAD_PROFILE_PICTURE_SUCCESS,
} from "../constants/user";
import api from "../utils/api";
import getErrorMessage from "../utils/getErrorMessage";

export const updateProfileInfo = (id, name, phone, address) => async(dispatch) => {
    try {
        dispatch({ type: USER_UPDATE_PROFILE_INFO_REQUEST });

        const { data } = await api.put(`/users/${id}/profile`, { name, phone, address });

        dispatch({
            type: USER_UPDATE_PROFILE_INFO_SUCCESS,
            payload: data.data,
        });
    } catch (error) {
        dispatch({
            type: USER_UPDATE_PROFILE_INFO_FAIL,
            payload: getErrorMessage(error, true),
        });
    }
};

export const uploadProfilePicture = (id, file, setUploadPercentage) => async(dispatch) => {
    try {
        dispatch({ type: USER_UPLOAD_PROFILE_PICTURE_REQUEST });

        const formData = new FormData();
        formData.append("files", file);

        const { data } = await api.put(`/users/${id}/avatar`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
                setUploadPercentage(parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total)));
            },
        });

        // clear progress bar percentage
        setTimeout(() => setUploadPercentage(0), 3000);

        dispatch({
            type: USER_UPLOAD_PROFILE_PICTURE_SUCCESS,
            payload: data.data,
        });
    } catch (error) {
        dispatch({
            type: USER_UPLOAD_PROFILE_PICTURE_FAIL,
            payload: getErrorMessage(error, true),
        });
        setUploadPercentage(0);
    }
};

export const setScheduleCompleted = (userId, scheduleId) => async(dispatch) => {
    try {
        dispatch({ type: USER_SET_SCHEDULE_COMPLETED_REQUEST });

        const { data } = await api.get(`/users/${userId}/schedule/${scheduleId}`);

        dispatch({
            type: USER_SET_SCHEDULE_COMPLETED_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: USER_SET_SCHEDULE_COMPLETED_FAIL,
            payload: getErrorMessage(error, true),
        });
    }
};