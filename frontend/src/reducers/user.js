import {
    USER_SET_SCHEDULE_COMPLETED_FAIL,
    USER_SET_SCHEDULE_COMPLETED_REQUEST,
    USER_SET_SCHEDULE_COMPLETED_RESET,
    USER_SET_SCHEDULE_COMPLETED_SUCCESS,
    USER_UPDATE_PROFILE_INFO_FAIL,
    USER_UPDATE_PROFILE_INFO_REQUEST,
    USER_UPDATE_PROFILE_INFO_RESET,
    USER_UPDATE_PROFILE_INFO_SUCCESS,
    USER_UPLOAD_PROFILE_PICTURE_FAIL,
    USER_UPLOAD_PROFILE_PICTURE_REQUEST,
    USER_UPLOAD_PROFILE_PICTURE_RESET,
    USER_UPLOAD_PROFILE_PICTURE_SUCCESS,
} from "../constants/user";

export const updateProfileInfo = (state = { success: false, message: "" }, action) => {
    switch (action.type) {
        case USER_UPDATE_PROFILE_INFO_REQUEST:
            return {...state, loading: true };
        case USER_UPDATE_PROFILE_INFO_SUCCESS:
            return {
                loading: false,
                success: true,
                message: "Profile info updated successfully",
            };
        case USER_UPDATE_PROFILE_INFO_FAIL:
            return { loading: false, success: false, error: action.payload };
        case USER_UPDATE_PROFILE_INFO_RESET:
            return { success: false, message: "" };
        default:
            return state;
    }
};

export const uploadProfilePicture = (state = { success: false, message: "", avatar: "" }, action) => {
    switch (action.type) {
        case USER_UPLOAD_PROFILE_PICTURE_REQUEST:
            return {...state, loading: true };
        case USER_UPLOAD_PROFILE_PICTURE_SUCCESS:
            return {
                loading: false,
                success: true,
                message: "Profile picture uploaded successfully",
                avatar: action.payload,
            };
        case USER_UPLOAD_PROFILE_PICTURE_FAIL:
            return { loading: false, success: false, error: action.payload };
        case USER_UPLOAD_PROFILE_PICTURE_RESET:
            return { success: false, message: "", avatar: "" };
        default:
            return state;
    }
};

export const setScheduleCompleted = (state = { success: false, message: "" }, action) => {
    switch (action.type) {
        case USER_SET_SCHEDULE_COMPLETED_REQUEST:
            return {...state, loading: true };
        case USER_SET_SCHEDULE_COMPLETED_SUCCESS:
            return {
                loading: false,
                success: action.payload.success,
                message: action.payload.message,
            };
        case USER_SET_SCHEDULE_COMPLETED_FAIL:
            return { loading: false, success: false, error: action.payload };
        case USER_SET_SCHEDULE_COMPLETED_RESET:
            return { success: false, message: "" };
        default:
            return state;
    }
};