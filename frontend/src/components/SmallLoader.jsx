import React from "react";
import { Spinner } from "react-bootstrap";

const SmallLoader = () => {
  return (
    <Spinner
      animation="border"
      role="status"
      style={{
        width: "25px",
        height: "25px",
        margin: "0 25px", // a little space around
        display: "block",
      }}
    >
      <span className="sr-only">Loading...</span>
    </Spinner>
  );
};

export default SmallLoader;
