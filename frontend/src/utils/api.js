import axios from "axios";

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
//         console.log(error.response);
//         if (error.response.status === 401) {
//             store.dispatch({ type: AUTH_LOGOUT });
//         }
//         return Promise.reject(error);
//     }
// );

export default api;