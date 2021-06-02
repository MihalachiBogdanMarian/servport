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
    <Form onSubmit={submitHandler} className="geo-search-form">
      <Form.Control
        type="text"
        name="address"
        onChange={(e) => setAddress(e.target.value)}
        placeholder="All the country..."
        className="mt-3 mb-3"
      ></Form.Control>

      <Form.Control as="select" defaultValue="+ 0 km" className="km-control mt-3 mb-3">
        <option>+ 0 km</option>
        <option>+ 1 km</option>
        <option>+ 2 km</option>
        <option>+ 3 km</option>
        <option>+ 5 km</option>
        <option>+ 7 km</option>
        <option>+ 10 km</option>
        <option>+ 15 km</option>
        <option>+ 20 km</option>
        <option>+ 25 km</option>
        <option>+ 50 km</option>
        <option>+ 75 km</option>
        <option>+ 100 km</option>
      </Form.Control>

      <Button type="submit" variant="outline-success" className="mb-3 p-2">
        GSearch
      </Button>
    </Form>
  );
};

export default GeoSearch;
