import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

const SearchBox = () => {
  const [text, setText] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    if (text.trim() !== "") {
    } else {
    }
  };

  return (
    <Form onSubmit={submitHandler} className="search-box-form">
      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setText(e.target.value)}
        placeholder="Search services..."
        className="mt-3 mb-3"
      ></Form.Control>
      <Button type="submit" variant="outline-success" className="mb-3 p-2">
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
