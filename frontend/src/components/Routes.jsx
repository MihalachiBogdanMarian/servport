import React from "react";
import { Route, Switch } from "react-router-dom";
import ForgotPassword from "../screens/ForgotPassword";
import Login from "../screens/Login";
import Profile from "../screens/Profile";
import Register from "../screens/Register";
import ResetPassword from "../screens/ResetPassword";
import Service from "../screens/Service";
import Services from "../screens/Services";
import Footer from "./Footer";
import NotFound from "./NotFound";
import PrivateRoute from "./PrivateRoute";
// import PrivateRoute from "./PrivateRoute";

const Routes = () => {
  return (
    <>
      <Switch>
        {/* <PrivateRoute exact path="" component={} /> */}
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/forgotpassword" component={ForgotPassword} />
        <Route exact path="/resetPassword" component={ResetPassword} />
        <Route exact path="/services/page/:pageNumber/category/:category" component={Services} />
        <Route exact path="/services/:id" component={Service} />
        <PrivateRoute exact path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </>
  );
};

export default Routes;
