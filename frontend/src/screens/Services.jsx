import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getServices } from "../actions/service";
import Filters from "../components/Filters";
import GeoSearch from "../components/GeoSearch";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Meta from "../components/Meta";
import Paginate from "../components/Paginate";
import SearchBox from "../components/SearchBox";
import ServiceCard from "../components/ServiceCard";
import TopServicesCarousel from "../components/TopServicesCarousel";
import { CHANGE_PAGE_NUMBER, RESET_PAGE_AND_FILTERS } from "../constants/service";

const Services = ({ history, match }) => {
  const category = match.params.category || "Services>Auto %26 Transportation>Car Services";

  const [isResetFiltersPressed, setIsResetFiltersPressed] = useState(false);

  const dispatch = useDispatch();

  const servicesList = useSelector((state) => state.servicesList);
  const { loading, error, services, pages, page } = servicesList;
  const pageAndFilters = useSelector((state) => state.pageAndFilters);
  const { pageNumber, filters } = pageAndFilters;
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const { userDetails } = loggedInUser;

  useEffect(() => {
    dispatch({ type: CHANGE_PAGE_NUMBER, payload: match.params.pageNumber || 1 });
  }, [dispatch, match.params.pageNumber]);

  useEffect(() => {
    dispatch(getServices(category, pageNumber, filters));
  }, [dispatch, category, pageNumber, filters]);

  return (
    <>
      {parseInt(pageNumber) === 1 && filters.length === 0 && (
        <Container className="top-rated-carousel-container">
          <Row className="justify-content-md-center">
            <TopServicesCarousel category={category}></TopServicesCarousel>
          </Row>
        </Container>
      )}
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={12} md={4} className="border border-dark shadow-sm">
            <Row className="justify-content-md-center">
              <Filters
                category={category}
                isResetFiltersPressed={isResetFiltersPressed}
                setIsResetFiltersPressed={setIsResetFiltersPressed}
              ></Filters>
            </Row>
          </Col>

          <Col xs={12} md={4} className="border border-dark shadow-sm">
            <Row className="justify-content-center align-items-center">
              <GeoSearch
                category={category}
                isResetFiltersPressed={isResetFiltersPressed}
                setIsResetFiltersPressed={setIsResetFiltersPressed}
              ></GeoSearch>
            </Row>
          </Col>

          <Col xs={12} md={4} className="border border-dark shadow-sm">
            <Row className="justify-content-center align-items-center">
              <SearchBox
                category={category}
                isResetFiltersPressed={isResetFiltersPressed}
                setIsResetFiltersPressed={setIsResetFiltersPressed}
              ></SearchBox>
            </Row>
          </Col>
        </Row>

        <Row className="justify-content-md-center">
          <Col xs={12} className="border border-dark shadow-sm d-flex justify-content-between">
            <Button
              type="button"
              variant="primary"
              className="m-3"
              onClick={() => {
                dispatch({ type: RESET_PAGE_AND_FILTERS });
                setIsResetFiltersPressed(true);
                history.push(`/services/page/1/category/${category}`);
              }}
            >
              Reset
            </Button>

            <Button
              type="button"
              variant="primary"
              className="m-3"
              onClick={() => {
                if (!userDetails) {
                  history.push("/login");
                } else {
                  history.push("/profile/postservice");
                }
              }}
            >
              Post Service Offer
            </Button>
          </Col>
        </Row>
      </Container>

      <Container className="services-container">
        <Row className="justify-content-md-center">
          <Col xs={12}>
            <Meta />
            {loading ? (
              <Loader />
            ) : error ? (
              <Message variant="danger">{error}</Message>
            ) : (
              <>
                <Row>
                  {services.map((service) => (
                    <ServiceCard key={service._id} service={service} />
                  ))}
                </Row>
                <Paginate pages={pages} page={page} serviceCategory={category} />
              </>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Services;
