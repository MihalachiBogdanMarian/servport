import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";

const Filters = () => {
  return (
    <>
      <DropdownButton id="dropdown-item-button" title="Price" className="m-3">
        <Dropdown.Item as="button">Small</Dropdown.Item>
        <Dropdown.Item as="button">Medium</Dropdown.Item>
        <Dropdown.Item as="button">Large</Dropdown.Item>
      </DropdownButton>
      <DropdownButton id="dropdown-item-button" title="Rating" className="m-3">
        <Dropdown.Item as="button">Small</Dropdown.Item>
        <Dropdown.Item as="button">Medium</Dropdown.Item>
        <Dropdown.Item as="button">Large</Dropdown.Item>
      </DropdownButton>
      <DropdownButton id="dropdown-item-button" title="No. of reviews" className="m-3">
        <Dropdown.Item as="button">Small</Dropdown.Item>
        <Dropdown.Item as="button">Medium</Dropdown.Item>
        <Dropdown.Item as="button">Large</Dropdown.Item>
      </DropdownButton>
    </>
  );
};

export default Filters;
