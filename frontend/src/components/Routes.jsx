import React from "react";
import { Route, Switch } from "react-router-dom";
import Alert from "./Alert";
import NotFound from "./NotFound";
// import PrivateRoute from "./PrivateRoute";

const Routes = () => {
  return (
    <>
      <Alert />
      <Switch>
        {/* <PrivateRoute exact path="" component={} /> */}
        <Route component={NotFound} />
      </Switch>
    </>
  );
};

export default Routes;
