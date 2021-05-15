import React from "react";
import { Route, Switch } from "react-router-dom";
import Login from "../screens/Login";
import Register from "../screens/Register";
import Footer from "./Footer";
import NotFound from "./NotFound";
// import PrivateRoute from "./PrivateRoute";

const Routes = () => {
  return (
    <>
      <Switch>
        {/* <PrivateRoute exact path="" component={} /> */}
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </>
  );
};

export default Routes;
