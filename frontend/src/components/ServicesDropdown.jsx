import React from "react";
import { NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const ServicesDropdown = () => {
  return (
    <>
      <NavDropdown title="Services" id="services">
        <LinkContainer to="/services/auto">
          <NavDropdown.Item>Auto</NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/services/transport">
          <NavDropdown.Item>Transport</NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/services/constructions">
          <NavDropdown.Item>Constructions</NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/services/installations">
          <NavDropdown.Item>Installations</NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/services/interior-design">
          <NavDropdown.Item>Interior Design</NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/services/roofs">
          <NavDropdown.Item>Roofs</NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/services/cleaning">
          <NavDropdown.Item>Cleaning</NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/services/decorations">
          <NavDropdown.Item>Decorations</NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/services/photo">
          <NavDropdown.Item>Photo</NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/services/lessons">
          <NavDropdown.Item>Private Lessons</NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/services/repairs">
          <NavDropdown.Item>Repairs</NavDropdown.Item>
        </LinkContainer>
      </NavDropdown>
    </>
  );
};

export default ServicesDropdown;
