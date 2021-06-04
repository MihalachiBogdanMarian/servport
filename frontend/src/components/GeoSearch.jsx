import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Select } from "react-functional-select";
import { useHistory } from "react-router";

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

const GeoSearch = ({ category, filters, setFilters, isResetFiltersPressed, setIsResetFiltersPressed }) => {
  const selectRef = useRef(null);

  let history = useHistory();

  const [address, setAddress] = useState("");
  const [kmOption, setKmOption] = useState({ value: "0", label: "+ 0 km" });

  const getOptionValue = useCallback((option) => option.value, []);
  const getOptionLabel = useCallback((option) => option.label, []);

  const setValueToDefault = () => selectRef.current?.setValue(kmOptions[0]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (address.trim() !== "") {
      const filterApplied = filters.find((filter) => filter.startsWith("geoSearch="));
      if (filterApplied) {
        setFilters([
          ...filters.filter((filter) => !filter.startsWith("geoSearchKm=")),
          "geoSearchAddress=" + address,
          "geoSearchKm=" + kmOption.value,
        ]);
      } else {
        setFilters([...filters, "geoSearch=1", "geoSearchAddress=" + address, "geoSearchKm=" + kmOption.value]);
      }

      history.push(`/services/page/1/category/${category}`);
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
  );
};

export default GeoSearch;
