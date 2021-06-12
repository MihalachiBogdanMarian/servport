import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../actions/auth";
import { updateProfileInfo, uploadProfilePicture } from "../actions/user";
import Loader from "./Loader";
import Message from "./Message";
import Progress from "./Progress";
import Rating from "./Rating";

const EditProfile = () => {
  const dispatch = useDispatch();

  const loggedInUser = useSelector((state) => state.loggedInUser);
  const {
    userDetails: {
      name: userDetailsName,
      phone: userDetailsPhone,
      address: userDetailsAddress,
      email,
      trustScore,
      _id,
      avatar,
    },
  } = loggedInUser;

  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("Upload picture");
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [name, setName] = useState(userDetailsName);
  const [phone, setPhone] = useState(userDetailsPhone);
  const [address, setAddress] = useState(userDetailsAddress);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmedNewPassword, setConfirmedNewPassword] = useState("");
  const [message, setMessage] = useState(null);

  const changePasswordData = useSelector((state) => state.changePasswordData);
  const { loading: loadingChangePassword, error: errorChangePassword, token } = changePasswordData;
  const updateProfileInfoStatus = useSelector((state) => state.updateProfileInfoStatus);
  const {
    loading: loadingUpdateProfileInfo,
    success: successUpdateProfileInfo,
    message: messageUpdateProfileInfo,
    error: errorUpdateProfileInfo,
  } = updateProfileInfoStatus;
  const uploadProfilePictureStatus = useSelector((state) => state.uploadProfilePictureStatus);
  const {
    loading: loadingUploadProfilePicture,
    success: successUploadProfilePicture,
    message: messageUploadProfilePicture,
    error: errorUploadProfilePicture,
  } = uploadProfilePictureStatus;

  const uploadProfilePictureHandler = (e) => {
    e.preventDefault();
    dispatch(uploadProfilePicture(_id, file, setUploadPercentage));
  };

  const updateProfileInfoHandler = (e) => {
    e.preventDefault();
    dispatch(updateProfileInfo(_id, name, phone, address));
  };

  const changePasswordHandler = (e) => {
    e.preventDefault();
    if (newPassword !== confirmedNewPassword) {
      setMessage("New passwords do not match");
    } else {
      dispatch(changePassword(currentPassword, confirmedNewPassword));
    }
  };

  return (
    <>
      <h1>Your Personal Info</h1>
      <div className="trust-score-div">
        <p className="card-text">
          <strong>Trust score:</strong>
        </p>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Rating value={trustScore} />
      </div>
      <p>
        <strong>Email:</strong> {email}
      </p>
      <br></br>
      <br></br>
      <hr></hr>
      <br></br>
      <br></br>
      <Container>
        <Row className="justify-content-md-center">
          <Col>
            <h2>Upload Profile Picture</h2>
            {successUploadProfilePicture && <Message variant="success">{messageUploadProfilePicture}</Message>}
            {loadingUploadProfilePicture && <Loader />}
            {errorUploadProfilePicture && <Message variant="danger">{errorUploadProfilePicture}</Message>}
            {avatar ? (
              <Row className="justify-content-md-center mt-3 mb-3">
                <Col className="profile-img-container">
                  <img
                    className="profile-img"
                    src={process.env.REACT_APP_FILE_UPLOAD_PATH + avatar}
                    alt="profile avatar"
                  />
                </Col>
              </Row>
            ) : null}
            <Progress percentage={uploadPercentage} />
            <Form onSubmit={uploadProfilePictureHandler}>
              <div className="mb-3">
                <label htmlFor="profilePicture" className="form-label">
                  {filename}
                </label>
                <input
                  className="form-control"
                  type="file"
                  id="profilePicture"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                    setFilename(e.target.files[0].name);
                  }}
                />
              </div>
              <Button type="submit" variant="primary">
                Upload
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
      <br></br>
      <br></br>
      <hr></hr>
      <br></br>
      <br></br>
      <Container>
        <Row className="justify-content-md-center">
          <Col>
            <h2>Update Profile Info</h2>
            {successUpdateProfileInfo && <Message variant="success">{messageUpdateProfileInfo}</Message>}
            {loadingUpdateProfileInfo && <Loader />}
            {errorUpdateProfileInfo && <Message variant="danger">{errorUpdateProfileInfo}</Message>}
            <Form onSubmit={updateProfileInfoHandler}>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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

              <Button type="submit" variant="primary">
                Update
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
      <br></br>
      <br></br>
      <hr></hr>
      <br></br>
      <br></br>
      <Container>
        <Row className="justify-content-md-center">
          <Col>
            <h2>Change Password</h2>
            {token && <Message variant="success">Password changed successfully</Message>}
            {message && <Message variant="danger">{message}</Message>}
            {errorChangePassword && <Message variant="danger">{errorChangePassword}</Message>}
            {loadingChangePassword && <Loader />}
            <Form onSubmit={changePasswordHandler}>
              <Form.Group controlId="oldPassword">
                <Form.Label>Old Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter old password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="newPassword">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="confirmedNewPassword">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmedNewPassword}
                  onChange={(e) => setConfirmedNewPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Button type="submit" variant="primary">
                Change
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default EditProfile;
