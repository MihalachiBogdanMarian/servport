import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

const GeoSearch = () => {
  const [address, setAddress] = useState("");
  const [km, setKm] = useState(0);

  const submitHandler = (e) => {
    e.preventDefault();
    if (address.trim()) {
    } else {
    }
  };

  return (
    <Form onSubmit={submitHandler} className="search-box-form">
      <Form.Control
        type="text"
        name="address"
        onChange={(e) => setAddress(e.target.value)}
        placeholder="All the country..."
        className="mt-3 mb-3"
      ></Form.Control>

      <Button type="submit" variant="outline-success" className="mb-3">
        GSearch
      </Button>
    </Form>
  );
};

export default GeoSearch;
