import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { logout } from "../actions/auth";
import ServicesDropdown from "./ServicesDropdown";

const Header = () => {
  const dispatch = useDispatch();

  const loggedInUser = useSelector((state) => state.loggedInUser);
  const { userDetails } = loggedInUser;

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header>
      <Navbar variant="dark" expand="lg" className="navbar-custom" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>ServPort</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <ServicesDropdown />

              {userDetails && userDetails.isAdmin && (
                <NavDropdown title="Admin" id="adminmenu">
                  <LinkContainer to="/admin/userslist">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/serviceslist">
                    <NavDropdown.Item>Services</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/requestslist">
                    <NavDropdown.Item>Requests</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
              {userDetails ? (
                <NavDropdown title={userDetails.name.split(" ")[0].split("-")[0]} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <LinkContainer to="/register">
                    <Nav.Link>
                      <i className="fas fa-user-plus"></i>&nbsp;Sign Up
                    </Nav.Link>
                  </LinkContainer>

                  <LinkContainer to="/login">
                    <Nav.Link>
                      <i className="fas fa-user"></i>&nbsp;Log In
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
