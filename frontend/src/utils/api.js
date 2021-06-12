import axios from "axios";
// import { AUTH_LOGOUT } from "../constants/auth";
// import { ERROR } from "../constants/error";
// import store from "../store";

const api = axios.create({
    baseURL: "http://localhost:5000/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 intercept any error responses from the api
 and check if the token is no longer valid
 ie. token has expired or user is no longer
 authenticated
 logout the user if the token has expired
**/
// api.interceptors.response.use(
//     (res) => res,
//     (error) => {
//         const message =
//             error.response && error.response.data.errorMessage ? error.response.data.errorMessage : error.message;
//         if (message === "Not authorized to access this route") {
//             store.dispatch({ type: AUTH_LOGOUT });
//         }
//         // store.dispatch({
//         //     type: ERROR,
//         //     payload: message,
//         // });
//         return Promise.reject(error);
//     }
// );

export default api;