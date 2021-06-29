import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Form, ListGroup, Row } from "react-bootstrap";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addReview, getServiceReviews, removeReview } from "../actions/review";
import Message from "../components/Message";
import Rating from "../components/Rating";
import { SERVICE_ADD_REVIEW_RESET, SERVICE_REMOVE_REVIEW_RESET } from "../constants/review";
import Loader from "./Loader";
import SmallLoader from "./SmallLoader";

const Reviews = ({ ownership, serviceId, matchServiceId }) => {
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [myReview, setMyReview] = useState(undefined);

  const dispatch = useDispatch();

  const latestSuccessAddReviewStatus = useRef();
  const latestSuccessRemoveReviewStatus = useRef();

  const loggedInUser = useSelector((state) => state.loggedInUser);
  const { userDetails } = loggedInUser;
  const serviceReviews = useSelector((state) => state.serviceReviews);
  const { currentServiceReviews } = serviceReviews;
  const addReviewStatus = useSelector((state) => state.addReviewStatus);
  const {
    loading: loadingAddReviewStatus,
    success: successAddReviewStatus,
    message: successAddReviewMessage,
    error: errorAddReviewStatus,
    stars,
  } = addReviewStatus;
  const removeReviewStatus = useSelector((state) => state.removeReviewStatus);
  const { success: successRemoveReviewStatus, message: successRemoveReviewMessage } = removeReviewStatus;

  useEffect(() => {
    dispatch(getServiceReviews(matchServiceId));
  }, [dispatch, matchServiceId]);

  useEffect(() => {
    // making sure current always point to fresh values of successes
    latestSuccessAddReviewStatus.current = successAddReviewStatus;
    latestSuccessRemoveReviewStatus.current = successRemoveReviewStatus;
  });

  useEffect(() => {
    if (currentServiceReviews) {
      setMyReview(currentServiceReviews.find((review) => review.user._id.toString() === userDetails._id.toString()));
    }
  }, [dispatch, currentServiceReviews, userDetails, matchServiceId]);

  useEffect(() => {
    if (successAddReviewStatus) {
      setTitle("");
      setComment("");
      dispatch(getServiceReviews(matchServiceId));
      if (latestSuccessRemoveReviewStatus) {
        dispatch({ type: SERVICE_REMOVE_REVIEW_RESET });
      }
    }
    if (!serviceId || serviceId !== matchServiceId) {
      dispatch(getServiceReviews(matchServiceId));
      dispatch({ type: SERVICE_ADD_REVIEW_RESET });
      dispatch({ type: SERVICE_REMOVE_REVIEW_RESET });
    }
  }, [dispatch, successAddReviewStatus, serviceId, matchServiceId]);

  useEffect(() => {
    if (successRemoveReviewStatus) {
      dispatch(getServiceReviews(matchServiceId));
      if (latestSuccessAddReviewStatus) {
        dispatch({ type: SERVICE_ADD_REVIEW_RESET });
      }
    }
    if (!serviceId || serviceId !== matchServiceId) {
      dispatch(getServiceReviews(matchServiceId));
      dispatch({ type: SERVICE_ADD_REVIEW_RESET });
      dispatch({ type: SERVICE_REMOVE_REVIEW_RESET });
    }
  }, [dispatch, successRemoveReviewStatus, serviceId, matchServiceId]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(addReview(matchServiceId, title, comment));
  };

  const removeReviewHandler = (serviceId, reviewId) => {
    dispatch(removeReview(serviceId, reviewId));
  };

  const removeReviewButtonPressed = () => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to delete this review?",
      buttons: [
        {
          label: "Cancel",
          onClick: () => {},
        },
        {
          label: "Confirm",
          onClick: () => removeReviewHandler(matchServiceId, myReview._id),
        },
      ],
    });
  };

  return (
    <>
      <h2>Reviews</h2>
      <ListGroup variant="flush">
        {!ownership && (
          <>
            <ListGroup.Item>
              <h2>Write a Customer Review</h2>
              {successAddReviewStatus && <Message variant="success">{successAddReviewMessage}</Message>}
              {loadingAddReviewStatus && <Loader />}
              {errorAddReviewStatus && <Message variant="danger">{errorAddReviewStatus}</Message>}
              {userDetails ? (
                <Form onSubmit={submitHandler}>
                  <Form.Group controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId="comment">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                      as="textarea"
                      row="3"
                      placeholder="Enter comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                  <Button disabled={loadingAddReviewStatus} type="submit" variant="primary">
                    Submit
                  </Button>
                </Form>
              ) : (
                <Message variant="success">
                  Please <Link to="/login">SIGN IN</Link> to write a review
                </Message>
              )}
            </ListGroup.Item>
            {successRemoveReviewStatus && <Message variant="success">{successRemoveReviewMessage}</Message>}
          </>
        )}
        {userDetails && currentServiceReviews ? (
          currentServiceReviews.length === 0 ? (
            <Message variant="success">No Reviews</Message>
          ) : (
            myReview && (
              <ListGroup.Item key={myReview._id}>
                <Row>
                  <Col xs={10}>
                    <strong>
                      {myReview.createdAt.substring(0, 10)} {myReview.user.name}
                    </strong>
                    <br></br>
                    <br></br>
                    <strong>{myReview.title}</strong>
                  </Col>
                  <Col xs={2}>
                    <button onClick={() => removeReviewButtonPressed()} type="button" className="btn btn-danger">
                      <i className="fas fa-times" />
                    </button>
                  </Col>
                </Row>
                <br></br>
                {myReview.rating ? (
                  <Rating value={myReview.rating} />
                ) : stars ? (
                  <Rating value={stars} />
                ) : (
                  <div className="computing-rating-container">
                    <span>Computing rating...</span>
                    <SmallLoader />
                  </div>
                )}
                <br></br>
                <p>{myReview.comment}</p>
              </ListGroup.Item>
            )
          )
        ) : (
          <Message variant="success">
            Please <Link to="/login">SIGN IN</Link> to check out users reviews
          </Message>
        )}
        {userDetails && currentServiceReviews ? (
          currentServiceReviews.length === 0 ? (
            <></>
          ) : (
            currentServiceReviews
              .filter((review) => review.user._id !== userDetails._id)
              .map((review) => (
                <ListGroup.Item key={review._id}>
                  <strong>
                    {review.createdAt.substring(0, 10)} {review.user.name}
                  </strong>
                  <br></br>
                  <br></br>
                  <strong>{review.title}</strong>
                  <br></br>
                  <br></br>
                  <Rating value={review.rating} />
                  <br></br>
                  <p>{review.comment}</p>
                </ListGroup.Item>
              ))
          )
        ) : (
          <></>
        )}
      </ListGroup>
    </>
  );
};

export default Reviews;
