import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { forgotPassword } from "../actions/auth";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Message from "../components/Message";

const ForgotPassword = ({ history, location }) => {
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();

  const loginData = useSelector((state) => state.loginData);
  const { token } = loginData;
  const forgotPasswordStatus = useSelector((state) => state.forgotPasswordStatus);
  const { loading, error, success, message } = forgotPasswordStatus;

  const redirect = location.search ? location.search.split("=")[1] : "/profile";

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    if (token) {
      history.push(redirect);
    }
  }, [history, token, redirect]);

  return (
    <FormContainer>
      <h1>Please Provide An Email</h1>
      <p>Where to send you a Reset Password Link</p>
      {success && <Message variant="success">{message}</Message>}
      {loading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}
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

        <Button type="submit" variant="primary">
          Send
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>Register</Link>
        </Col>
      </Row>
      <Row className="py-3">
        <Col>
          Remembered password? <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>Sign In</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default ForgotPassword;
