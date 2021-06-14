import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Prompt } from "react-router";
import { Link } from "react-router-dom";
import { login } from "../actions/auth";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { AUTH_LOGOUT } from "../constants/auth";

const Login = ({ location, history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const loginData = useSelector((state) => state.loginData);
  const { loading, error, token } = loginData;
  const resetPasswordStatus = useSelector((state) => state.resetPasswordStatus);
  const { success } = resetPasswordStatus;

  const redirect = location.search ? location.search.split("=")[1] : "/profile";

  useEffect(() => {
    if (token) {
      // user is logged in
      history.goBack();
      // history.push(redirect);
    }
  }, [history, token, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  const handleLeavingPage = () => {
    if (error) {
      dispatch({ type: AUTH_LOGOUT });
    }
  };

  return (
    <>
      <Prompt message={handleLeavingPage} />
      <FormContainer>
        <h1>Sign In</h1>
        {success && <Message variant="success">{"Password reset successfully"}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <Button type="submit" variant="primary">
            Sign In
          </Button>
        </Form>

        <Row className="py-3">
          <Col>
            New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>Register</Link>
          </Col>
        </Row>
        <Row className="py-3">
          <Col>
            Forgot Password?{" "}
            <Link to={redirect ? `/forgotpassword?redirect=${redirect}` : "/forgotpassword"}>Reset Password</Link>
          </Col>
        </Row>
      </FormContainer>
    </>
  );
};

export default Login;
