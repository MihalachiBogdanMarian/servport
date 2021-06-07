import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Select } from "react-functional-select";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { addFilter } from "../actions/service";
import Message from "../components/Message";

const kmOptions = [
  { value: "0", label: "+ 0 km" },
  { value: "1", label: "+ 1 km" },
  { value: "2", label: "+ 2 km" },
  { value: "3", label: "+ 3 km" },
  { value: "5", label: "+ 5 km" },
  { value: "7", label: "+ 7 km" },
  { value: "10", label: "+ 10 km" },
  { value: "15", label: "+ 15 km" },
  { value: "20", label: "+ 20 km" },
  { value: "25", label: "+ 25 km" },
  { value: "50", label: "+ 50 km" },
  { value: "75", label: "+ 75 km" },
  { value: "100", label: "+ 100 km" },
];

const themeConfig = {
  select: {
    css: "margin: 0 auto; max-width: 150px;",
  },
};

const GeoSearch = ({ category, isResetFiltersPressed, setIsResetFiltersPressed }) => {
  const selectRef = useRef(null);

  let history = useHistory();

  const dispatch = useDispatch();

  const pageAndFilters = useSelector((state) => state.pageAndFilters);
  const { filters } = pageAndFilters;
  const geoAddressApplied = filters.find((filter) => filter.startsWith("geoSearchAddress="));
  const geoKmApplied = filters.find((filter) => filter.startsWith("geoSearchKm="));
  const geoSearchAddress = geoAddressApplied ? geoAddressApplied.split("=")[1] : "";
  const geoSearchKm = geoKmApplied
    ? kmOptions.find((kmOption) => (kmOption.value = geoKmApplied))
    : { value: "0", label: "+ 0 km" };

  const [address, setAddress] = useState(geoSearchAddress);
  const [kmOption, setKmOption] = useState(geoSearchKm);
  const [error, setError] = useState("");

  const getOptionValue = useCallback((option) => option.value, []);
  const getOptionLabel = useCallback((option) => option.label, []);

  const setValueToDefault = () => selectRef.current?.setValue(kmOptions[0]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (address.trim() !== "") {
      dispatch(addFilter("geoSearch=1", address, kmOption));

      history.push(`/services/page/1/category/${category}`);
    } else {
      setError("Please provide an address");
    }
  };

  useEffect(() => {
    if (isResetFiltersPressed) {
      setAddress("");
      setKmOption({ value: "0", label: "+ 0 km" });
      setValueToDefault();
      setIsResetFiltersPressed(false);
    }
  }, [isResetFiltersPressed, setIsResetFiltersPressed]);

  return (
    <>
      {error && <Message variant="danger">{error}</Message>}
      <Form onSubmit={submitHandler} className="geo-search-form">
        <Form.Control
          type="text"
          name="address"
          onChange={(e) => setAddress(e.target.value)}
          placeholder="All the country..."
          className="mt-3 mb-3"
          value={address}
          required
        ></Form.Control>

        <Select
          ref={selectRef}
          options={kmOptions}
          getOptionValue={getOptionValue}
          getOptionLabel={getOptionLabel}
          initialValue={kmOptions[0]}
          onOptionChange={setKmOption}
          themeConfig={themeConfig}
        />

        <Button type="submit" variant="outline-success" className="mt-3 mb-3 p-2">
          Geo-Search
        </Button>
      </Form>
    </>
  );
};

export default GeoSearch;
