import React, { useEffect } from "react";
import { Provider } from "react-redux"; /* Redux */
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { getMe } from "./actions/auth"; /* Redux */
import Header from "./components/Header";
import Routes from "./components/Routes";
import { AUTH_LOGIN_SUCCESS, AUTH_LOGOUT } from "./constants/auth";
import Home from "./screens/Home";
import store from "./store"; /* Redux */
import setAuthToken from "./utils/setAuthToken"; /* Redux */

const App = () => {
  useEffect(() => {
    // check for token in Local Storage
    if (localStorage.token) {
      setAuthToken(localStorage.token);
      store.dispatch({
        type: AUTH_LOGIN_SUCCESS,
        payload: localStorage.token,
      });
      store.dispatch(getMe());
    }

    // log user out from all tabs if they log out in one tab
    window.addEventListener("storage", () => {
      if (!localStorage.token) store.dispatch({ type: AUTH_LOGOUT });
    });
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Header />
        <main className="py-3">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route component={Routes} />
          </Switch>
        </main>
      </Router>
    </Provider>
  );
};

export default App;
