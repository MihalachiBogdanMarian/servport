import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import Loader from "./Loader";

// ...rest -> custom props
const PrivateRoute = ({ component: Component, ...rest }) => {
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const { loading, userDetails } = loggedInUser;

  return (
    <Route
      {...rest}
      render={(props) => (loading ? <Loader /> : userDetails ? <Component {...props} /> : <Redirect to="/" />)}
    />
  );
};

export default PrivateRoute;
