import React, { useEffect, useState } from "react";
import { Button, Form, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addReview, getServiceReviews } from "../actions/review";
import Message from "../components/Message";
import Rating from "../components/Rating";
import { SERVICE_ADD_REVIEW_RESET } from "../constants/review";
import Loader from "./Loader";

const Reviews = ({ userDetails, serviceId, matchServiceId }) => {
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();

  const serviceReviews = useSelector((state) => state.serviceReviews);
  const { currentServiceReviews } = serviceReviews;
  const addReviewStatus = useSelector((state) => state.addReviewStatus);
  const {
    loading: loadingAddReviewStatus,
    success: successAddReviewStatus,
    message: successAddReviewMessage,
    error: errorAddReviewStatus,
  } = addReviewStatus;
  const removeReviewStatus = useSelector((state) => state.removeReviewStatus);
  const {
    loading: loadingRemoveReviewStatus,
    success: successRemoveReviewStatus,
    message: successRemoveReviewMessage,
    error: errorRemoveReviewStatus,
  } = removeReviewStatus;

  useEffect(() => {
    dispatch(getServiceReviews(serviceId));
  }, [dispatch, serviceId]);

  useEffect(() => {
    if (successAddReviewStatus) {
      setTitle("");
      setComment("");
      dispatch(getServiceReviews(serviceId));
    }
    if (!serviceId || serviceId !== matchServiceId) {
      dispatch(getServiceReviews(serviceId));
      dispatch({ type: SERVICE_ADD_REVIEW_RESET });
    }
  }, [dispatch, successAddReviewStatus, serviceId, matchServiceId]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(addReview(serviceId, title, comment));
  };

  return (
    <>
      <h2>Reviews</h2>
      <ListGroup variant="flush">
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
              Please <Link to="/login">Sign in</Link> to write a review
            </Message>
          )}
        </ListGroup.Item>
        {userDetails ? (
          currentServiceReviews.length === 0 ? (
            <Message variant="success">No Reviews</Message>
          ) : (
            currentServiceReviews
              .filter((review) => review.user._id !== userDetails._id)
              .map((review) => (
                <ListGroup.Item key={review._id}>
                  <strong>{review.user.name}</strong>
                  <br></br>
                  <strong>{review.title}</strong>
                  <br></br>
                  <br></br>
                  <Rating value={review.rating} />
                  <br></br>
                  <p>{review.createdAt.substring(0, 10)}</p>
                  <p>{review.comment}</p>
                </ListGroup.Item>
              ))
          )
        ) : (
          <Message variant="success">
            Please <Link to="/login">Sign in</Link> to check out users reviews
          </Message>
        )}
      </ListGroup>
    </>
  );
};

export default Reviews;
