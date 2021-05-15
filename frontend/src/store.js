import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import mainReducer from "./reducers";
import setAuthToken from "./utils/setAuthToken";

const requestServicesFromStorage = localStorage.getItem("requestServices") ?
    JSON.parse(localStorage.getItem("requestServices")) :
    undefined;

const userDetailsFromStorage = localStorage.getItem("userDetails") ?
    JSON.parse(localStorage.getItem("userDetails")) :
    undefined;

const executionAddressesFromStorage = localStorage.getItem("executionAddresses") ?
    JSON.parse(localStorage.getItem("executionAddresses")) :
    undefined;

const initialState = {
    request: { requestServices: requestServicesFromStorage, executionAddresses: executionAddressesFromStorage },
    loggedInUser: { userDetails: userDetailsFromStorage },
};

const middleware = [thunk];

const store = createStore(mainReducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

// set up a store subscription listener
// to store the users token in localStorage

// initialize current state from redux store for subscription comparison
// preventing undefined error
let currentState = store.getState();

store.subscribe(() => {
    // keep track of the previous and current state to compare changes
    let previousState = currentState;
    currentState = store.getState();
    // if the token changes set the value in localStorage and axios headers
    if (previousState.loggedInUser.token !== currentState.loggedInUser.token) {
        const token = currentState.loggedInUser.token;
        setAuthToken(token);
    }
});

export default store;