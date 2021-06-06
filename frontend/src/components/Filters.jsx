import React, { useEffect, useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { addFilter } from "../actions/service";

const Filters = ({ category, isResetFiltersPressed, setIsResetFiltersPressed }) => {
  let history = useHistory();

  const [priceButtonLabel, setPriceButtonLabel] = useState("Price");
  const [ratingButtonLabel, setRatingButtonLabel] = useState("Rating");
  const [numReviewsButtonLabel, setNumReviewsButtonLabel] = useState("No. of Reviews");

  const dispatch = useDispatch();

  const filter = (field, value) => {
    dispatch(addFilter(field + "=" + value));

    switch (field) {
      case "labels[price]":
        setPriceButtonLabel("Price - " + value.charAt(0).toUpperCase());
        break;
      case "labels[rating]":
        setRatingButtonLabel("Rating - " + value.charAt(0).toUpperCase());
        break;
      case "labels[numReviews]":
        setNumReviewsButtonLabel("No. of Reviews - " + value.charAt(0).toUpperCase());
        break;
      default:
        break;
    }

    history.push(`/services/page/1/category/${category}`);
  };

  useEffect(() => {
    if (isResetFiltersPressed) {
      setPriceButtonLabel("Price");
      setRatingButtonLabel("Rating");
      setNumReviewsButtonLabel("No. of Reviews");
      setIsResetFiltersPressed(false);
    }
  }, [isResetFiltersPressed, setIsResetFiltersPressed]);

  return (
    <>
      <DropdownButton id="dropdown-item-button" title={priceButtonLabel} className="m-3">
        <Dropdown.Item
          as="button"
          onClick={() => {
            filter("labels[price]", "small");
          }}
        >
          small
        </Dropdown.Item>
        <Dropdown.Item
          as="button"
          onClick={() => {
            filter("labels[price]", "medium");
          }}
        >
          medium
        </Dropdown.Item>
        <Dropdown.Item
          as="button"
          onClick={() => {
            filter("labels[price]", "large");
          }}
        >
          large
        </Dropdown.Item>
      </DropdownButton>
      <DropdownButton id="dropdown-item-button" title={ratingButtonLabel} className="m-3">
        <Dropdown.Item
          as="button"
          onClick={() => {
            filter("labels[rating]", "small");
          }}
        >
          small
        </Dropdown.Item>
        <Dropdown.Item
          as="button"
          onClick={() => {
            filter("labels[rating]", "medium");
          }}
        >
          medium
        </Dropdown.Item>
        <Dropdown.Item
          as="button"
          onClick={() => {
            filter("labels[rating]", "large");
          }}
        >
          large
        </Dropdown.Item>
      </DropdownButton>
      <DropdownButton id="dropdown-item-button" title={numReviewsButtonLabel} className="m-3">
        <Dropdown.Item
          as="button"
          onClick={() => {
            filter("labels[numReviews]", "small");
          }}
        >
          small
        </Dropdown.Item>
        <Dropdown.Item
          as="button"
          onClick={() => {
            filter("labels[numReviews]", "medium");
          }}
        >
          medium
        </Dropdown.Item>
        <Dropdown.Item
          as="button"
          onClick={() => {
            filter("labels[numReviews]", "large");
          }}
        >
          large
        </Dropdown.Item>
      </DropdownButton>
    </>
  );
};

export default Filters;
