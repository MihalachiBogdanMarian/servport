import api from "./api";

const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.Authorization = "Bearer " + token;
        localStorage.setItem("token", token);
    } else {
        api.defaults.headers.Authorization = undefined;
        localStorage.removeItem("token");
    }
};

export default setAuthToken;