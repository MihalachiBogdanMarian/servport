import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Prompt } from "react-router";
import { Link } from "react-router-dom";
import { register } from "../actions/auth";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { AUTH_REGISTER_RESET } from "../constants/auth";

const Register = ({ location, history }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const registerData = useSelector((state) => state.registerData);
  const { loading, error, token } = registerData;
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const { userDetails } = loggedInUser;

  const redirect = location.search ? location.search.split("=")[1] : "/profile";

  useEffect(() => {
    if (token || userDetails) {
      history.push(redirect);
    }
  }, [history, token, redirect, userDetails]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmedPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(register(name, email, phone, password, address));
    }
  };

  const handleLeavingPage = () => {
    if (error) {
      dispatch({ type: AUTH_REGISTER_RESET });
    }
  };

  return (
    <>
      <Prompt message={handleLeavingPage} />
      <FormContainer>
        <h1>Sign Up</h1>
        {message && <Message variant="danger">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="phone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Enter phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="confirmedPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmedPassword}
              onChange={(e) => setConfirmedPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary">
            Register
          </Button>
        </Form>

        <Row className="py-3">
          <Col>
            Have an Account? <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>Login</Link>
          </Col>
        </Row>
      </FormContainer>
    </>
  );
};

export default Register;
