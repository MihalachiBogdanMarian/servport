import { AUTH_LOGOUT } from "../constants/auth";
import store from "../store";

const getErrorMessage = (error, withNotAuthCheck = false) => {
    const message = error.response && error.response.data.errorMessage ? error.response.data.errorMessage : error.message;
    if (withNotAuthCheck) {
        if (message === "Not authorized to access this route") {
            store.dispatch({ type: AUTH_LOGOUT });
        }
    }
    return message;
};

export default getErrorMessage;