import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

const Alert = ({ alerts }) =>
  typeof alerts !== "undefined" &&
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map((alert) => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

// map the redux state to the props
const mapStateToProps = (state) => ({
  alerts: state.alert,
});

export default connect(mapStateToProps)(Alert);
