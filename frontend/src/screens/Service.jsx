/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useCallback, useEffect, useState } from "react";
import { Badge, Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { Select } from "react-functional-select";
import { useDispatch, useSelector } from "react-redux";
import ReactTooltip from "react-tooltip";
import { getServiceDetails } from "../actions/service";
import ImageCarousel from "../components/ImageCarousel";
import Loader from "../components/Loader";
import Message from "../components/Message";
import OwnerCard from "../components/OwnerCard";
import Rating from "../components/Rating";
import Reviews from "../components/Reviews";
import formatAvailabilityPeriod from "../utils/formatAvailabilityPeriod";
import formatDate from "../utils/formatDate";
import hasExpired from "../utils/hasExpired";

const themeConfig = {
  select: {
    css: "width: 450px;",
  },
};

const Service = ({ history, match }) => {
  const serviceId = match.params.id;

  const dispatch = useDispatch();

  const [isPriceButtonPressed, setPriceButtonPressed] = useState(false);
  const [executionAddressOptions, setExecutionAddressOptions] = useState([]);
  const [availabilityPeriodOptions, setAvailabilityPeriodOptions] = useState([]);
  const [hasPaymentPermissionExpired, setPaymentPermissionExpired] = useState(false);
  const [paymentPermissionReceived, setPaymentPermissionReceived] = useState(undefined);
  const [agreedPrice, setAgreedPrice] = useState("--.--$");

  const loggedInUser = useSelector((state) => state.loggedInUser);
  const { userDetails } = loggedInUser;
  const serviceDetails = useSelector((state) => state.serviceDetails);
  const { loading, error, currentService, percentage } = serviceDetails;
  // const pageAndFilters = useSelector((state) => state.pageAndFilters);
  // const { pageNumber } = pageAndFilters;
  // const pricePercentage = useSelector((state) => state.pricePercentage);

  const getOptionValue = useCallback((option) => option.value, []);
  const getOptionLabel = useCallback((option) => option.label, []);

  useEffect(() => {
    dispatch(getServiceDetails(serviceId));
  }, [dispatch, serviceId]);

  useEffect(() => {
    if (currentService && "title" in currentService) {
      setExecutionAddressOptions([
        ...currentService.addresses.map((address) => {
          return { value: address, label: address, isDisabled: true };
        }),
      ]);
      setAvailabilityPeriodOptions([
        ...currentService.availabilityPeriods.map((availabilityPeriod) => {
          return {
            value: formatAvailabilityPeriod(availabilityPeriod.startTime, availabilityPeriod.endTime),
            label: formatAvailabilityPeriod(availabilityPeriod.startTime, availabilityPeriod.endTime),
            isDisabled: true,
          };
        }),
      ]);

      if (userDetails) {
        setPaymentPermissionExpired(
          currentService.paymentCanProceedUsers.find(
            (paymentUser) => paymentUser.user === userDetails._id && hasExpired(paymentUser.expiresAt)
          )
        );
        setPaymentPermissionReceived(
          currentService.paymentCanProceedUsers.find(
            (paymentUser) => paymentUser.user === userDetails._id && !hasExpired(paymentUser.expiresAt)
          )
        );
        setAgreedPrice(paymentPermissionReceived ? paymentPermissionReceived.price + "$" : "--.--$");
      }
    }
  }, [dispatch, currentService, userDetails, paymentPermissionReceived]);

  // useEffect(() => {
  //   dispatch(getPricePercentage(serviceId));
  // }, [dispatch, serviceId, userDetails]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        currentService &&
        "title" in currentService && (
          <Container className="shadow-container">
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
                onClick={() => {
                  // history.push(`/services/page/${pageNumber}/category/${currentService.category.replace("&", "%26")}`);
                  history.goBack();
                }}
              >
                GO BACK
              </button>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                {userDetails ? (
                  <OwnerCard ownerDetails={currentService.user} blocked={false}></OwnerCard>
                ) : (
                  <OwnerCard ownerDetails={currentService.user} blocked={true}></OwnerCard>
                )}
                <Card className="shadow-container">
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        {hasPaymentPermissionExpired && (
                          <Message variant="success">
                            Payment permission expired! Please contact the owner again
                          </Message>
                        )}
                        <Col>Price:</Col>
                        <Col>
                          <strong>{agreedPrice}</strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <a data-tip data-for="paymentTooltip">
                        <Button
                          data-tip
                          data-for="paymentTooltip"
                          onClick={() => history.push("/request")}
                          className="btn-block"
                          type="button"
                          disabled={paymentPermissionReceived === undefined}
                        >
                          Proceed to Payment
                        </Button>
                      </a>
                      {paymentPermissionReceived === undefined ? (
                        <ReactTooltip id="paymentTooltip" effect="solid" place="bottom">
                          <span>
                            you first have to contact the owner <br></br>&nbsp;&nbsp;&nbsp;&nbsp;and agree on price and
                            period
                          </span>
                        </ReactTooltip>
                      ) : (
                        <></>
                      )}
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <ImageCarousel images={currentService.images}></ImageCarousel>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6} className="order-md-1 order-2">
                <Reviews serviceId={currentService._id} matchServiceId={serviceId}></Reviews>
              </Col>
              <Col xs={12} md={6} className="order-md-2 order-1">
                <p>
                  <small className="text-muted">Posted at: {formatDate(currentService.createdAt)}</small>
                </p>
                <h5>{currentService.title}</h5>
                <Rating value={currentService.rating}></Rating>
                <hr></hr>
                <Row className="justify-content-between align-items-center">
                  <p className="pt-3 ml-3 mr-3 align-self-center">
                    Prices between: {currentService.price.minPrice}$ - {currentService.price.maxPrice}$
                  </p>
                  {isPriceButtonPressed ? (
                    <Badge
                      pill
                      variant={percentage <= 50.0 ? "danger" : "success"}
                      className="badge-font-large ml-3 mr-3 p-2"
                    >
                      &lt;&nbsp;{percentage}%
                    </Badge>
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
                      <a data-tip data-for="loggedInTooltip">
                        <Button type="submit" variant="outline-success" className="ml-3 mr-3" disabled>
                          Show price percentage
                        </Button>
                      </a>
                      <ReactTooltip id="loggedInTooltip" effect="solid" place="top">
                        <span className="tooltip-span">
                          you have to be logged in <br></br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;in order to see
                          <br></br> &nbsp;&nbsp;&nbsp;the price percentage
                        </span>
                      </ReactTooltip>
                    </>
                  )}
                </Row>
                <hr></hr>
                <h6>Description</h6>
                <p>{currentService.description}</p>
                <hr></hr>
                <Row className="justify-content-start m-3">
                  <Select
                    menuPosition="top"
                    options={executionAddressOptions}
                    getOptionValue={getOptionValue}
                    getOptionLabel={getOptionLabel}
                    initialValue={{ value: "Check available locations", label: "Check available locations" }}
                    themeConfig={themeConfig}
                  />
                </Row>
                <Row className="justify-content-end m-3">
                  <Select
                    menuPosition="top"
                    options={availabilityPeriodOptions}
                    getOptionValue={getOptionValue}
                    getOptionLabel={getOptionLabel}
                    initialValue={{ value: "Check availability periods", label: "Check availability periods" }}
                    themeConfig={themeConfig}
                  />
                </Row>
              </Col>
            </Row>
          </Container>
        )
      )}
    </>
  );
};

export default Service;
