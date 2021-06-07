import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { addFilter } from "../actions/service";
import Message from "../components/Message";

const SearchBox = ({ category, isResetFiltersPressed, setIsResetFiltersPressed }) => {
  let history = useHistory();

  const pageAndFilters = useSelector((state) => state.pageAndFilters);
  const { filters } = pageAndFilters;
  const textFilterApplied = filters.find((filter) => filter.startsWith("textSearchDescription="));
  const textSearchDescription = textFilterApplied ? textFilterApplied.split("=")[1] : "";

  const [text, setText] = useState(textSearchDescription);
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    if (text.trim() !== "") {
      dispatch(addFilter("textSearch=1", "", {}, text));

      history.push(`/services/page/1/category/${category}`);
    } else {
      setError("Please provide a description");
    }
  };

  useEffect(() => {
    if (isResetFiltersPressed) {
      setText("");
      setIsResetFiltersPressed(false);
    }
  }, [isResetFiltersPressed, setIsResetFiltersPressed]);

  return (
    <>
      {error && <Message variant="danger">{error}</Message>}
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
    </>
  );
};

export default SearchBox;
