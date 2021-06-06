import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ReactTooltip from "react-tooltip";
import { getServiceDetails } from "../actions/service";
import ImageCarousel from "../components/ImageCarousel";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { getPricePercentage } from "../reducers/service";
import formatDate from "../utils/formatDate";

const Service = ({ history, match }) => {
  const serviceId = match.params.id;

  const dispatch = useDispatch();

  const [isPriceButtonPressed, setPriceButtonPressed] = useState(false);

  const serviceDetails = useSelector((state) => state.serviceDetails);
  const { loading, error, currentService } = serviceDetails;
  const pageAndFilters = useSelector((state) => state.pageAndFilters);
  const { pageNumber } = pageAndFilters;
  const pricePercentage = useSelector((state) => state.pricePercentage);
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const { userDetails } = loggedInUser;

  useEffect(() => {
    dispatch(getServiceDetails(serviceId));
    dispatch(getPricePercentage(serviceId));
  }, [dispatch, serviceId]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        currentService &&
        "title" in currentService && (
          <Container className="service-container">
            <Row className="justify-content-between">
              <span className="current-service-stats">
                <p>
                  {currentService.category.split(">")[currentService.category.split(">").length - 1]}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </p>
                <p>
                  <i className="fas fa-eye"></i>
                  &nbsp;&nbsp;
                  {currentService.numViews.toString()}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <i className="fas fa-users"></i>
                  &nbsp;&nbsp;
                  {currentService.numInterested.toString()}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </p>
                <input className="interested-star" type="checkbox" title="interested in service" defaultChecked></input>
              </span>
              <button
                className="shadow-button"
                onClick={() =>
                  history.push(`/services/page/${pageNumber}/category/${currentService.category.replace("&", "%26")}`)
                }
              >
                GO BACK
              </button>
            </Row>
            <Row>
              <Col xs={12} md={6}></Col>
              <Col xs={12} md={6}>
                <ImageCarousel images={currentService.images}></ImageCarousel>
                <p>
                  <small className="text-muted">Posted at: {formatDate(currentService.createdAt)}</small>
                </p>
                <h5>{currentService.title}</h5>
                <hr></hr>
                <Row className="justify-content-between align-items-center">
                  <p className="ml-3 mr-3">
                    Prices between: {currentService.price.minPrice}$ - {currentService.price.maxPrice}$
                  </p>
                  {isPriceButtonPressed ? (
                    <>
                      <Badge
                        pill
                        variant={pricePercentage.percentage <= 50.0 ? "success" : "danger"}
                        className="ml-3 mr-3 p-2"
                      >
                        &lt;&nbsp;{pricePercentage.percentage}%
                      </Badge>
                    </>
                  ) : userDetails ? (
                    <Button
                      type="submit"
                      variant="outline-success"
                      className="ml-3 mr-3"
                      onClick={() => setPriceButtonPressed(true)}
                    >
                      Show price percentage
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="submit"
                        variant="outline-success"
                        className="ml-3 mr-3"
                        disabled
                        data-tip="you have to <br> be logged in"
                      >
                        Show price percentage
                      </Button>
                      <ReactTooltip />
                    </>
                  )}
                </Row>
                <hr></hr>
                <h6>Description</h6>
                <p>{currentService.description}</p>
                <hr></hr>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}></Col>
              <Col xs={12} md={6}></Col>
            </Row>
          </Container>
        )
      )}
    </>
  );
};

export default Service;
