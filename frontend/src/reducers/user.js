import {
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
                message: "Profile updated successfully",
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
            return { success: false, message: "" };
        default:
            return state;
    }
};