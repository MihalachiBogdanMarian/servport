import React from "react";
import { NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const ServicesDropdown = () => {
  return (
    <>
      <NavDropdown title="Services" id="services">
        <LinkContainer to="/services/page/1/category/Services>Auto %26 Transportation>Car Services">
          <NavDropdown.Item>Auto</NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/services/page/1/category/Services>Auto %26 Transportation>Transport Services">
          <NavDropdown.Item>Transport</NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/services/page/1/category/Services>Craftsmen %26 Builders>Constructions">
          <NavDropdown.Item>Constructions</NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/services/page/1/category/Services>Craftsmen %26 Builders>Sanitary, Thermal, AC Installations">
          <NavDropdown.Item>Installations</NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/services/page/1/category/Services>Craftsmen %26 Builders>Interior Design">
          <NavDropdown.Item>Interior Design</NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/services/page/1/category/Services>Craftsmen %26 Builders>Roofs">
          <NavDropdown.Item>Roofs</NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/services/page/1/category/Services>Cleaning">
          <NavDropdown.Item>Cleaning</NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/services/page/1/category/Services>Events>Floral Arrangements %26 Decorations">
          <NavDropdown.Item>Decorations</NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/services/page/1/category/Services>Events>Photo %26 Video">
          <NavDropdown.Item>Photo</NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/services/page/1/category/Services>Private Lessons">
          <NavDropdown.Item>Private Lessons</NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/services/page/1/category/Services>Repairs: PC, Electronics, Home Appliances">
          <NavDropdown.Item>Repairs</NavDropdown.Item>
        </LinkContainer>
      </NavDropdown>
    </>
  );
};

export default ServicesDropdown;
