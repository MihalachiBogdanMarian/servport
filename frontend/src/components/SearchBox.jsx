import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useHistory } from "react-router";

const SearchBox = ({ category, filters, setFilters, isResetFiltersPressed, setIsResetFiltersPressed }) => {
  let history = useHistory();

  const [text, setText] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    if (text.trim() !== "") {
      const filterApplied = filters.find((filter) => filter.startsWith("textSearch="));
      if (filterApplied) {
        setFilters([
          ...filters.filter((filter) => !filter.startsWith("textSearchDescription=")),
          "textSearchDescription=" + text,
        ]);
      } else {
        setFilters([...filters, "textSearch=1", "textSearchDescription=" + text]);
      }

      history.push(`/services/page/1/category/${category}`);
    }
  };

  useEffect(() => {
    if (isResetFiltersPressed) {
      setText("");
      setIsResetFiltersPressed(false);
    }
  }, [isResetFiltersPressed, setIsResetFiltersPressed]);

  return (
    <Form onSubmit={submitHandler} className="search-box-form">
      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setText(e.target.value)}
        placeholder="Search services..."
        className="mt-3 mb-3"
        value={text}
        required
      ></Form.Control>

      <Button type="submit" variant="outline-success" className="mb-3 p-2">
        Text-Search
      </Button>
    </Form>
  );
};

export default SearchBox;
