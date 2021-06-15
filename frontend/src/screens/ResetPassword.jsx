import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../actions/auth";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Message from "../components/Message";

const ResetPassword = ({ match, history, location }) => {
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const loginData = useSelector((state) => state.loginData);
  const { token } = loginData;
  const resetPasswordStatus = useSelector((state) => state.resetPasswordStatus);
  const { loading, error, success } = resetPasswordStatus;

  const redirect = location.search ? location.search.split("=")[1] : "/profile/profile";

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(resetPassword(password, match.params.resettoken));
  };

  useEffect(() => {
    if (success) {
      history.push("/login");
    }
  }, [history, success]);

  useEffect(() => {
    if (token) {
      history.push(redirect);
    }
  }, [history, token, redirect]);

  return (
    <FormContainer>
      <h1>Reset Password</h1>
      {loading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="password">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary">
          Reset
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ResetPassword;
