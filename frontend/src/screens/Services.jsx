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
import Service from "../components/Service";

const Services = ({ match }) => {
  console.log(match);
  const pageNumber = match.params.pageNumber || 1;
  const category = match.params.category || "Services>Auto %26 Transportation>Car Services";

  const [filters, setFilters] = useState([]);

  const dispatch = useDispatch();

  const servicesList = useSelector((state) => state.servicesList);
  const { loading, error, services, pages, page } = servicesList;

  useEffect(() => {
    dispatch(getServices(category, pageNumber, filters));
  }, [dispatch, category, pageNumber, filters]);

  return (
    <>
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={12} md={4} className="border">
            <Row className="justify-content-md-center">
              <Filters></Filters>
            </Row>
          </Col>
          <Col xs={12} md={4} className="border">
            <Row className="justify-content-center align-items-center">
              <GeoSearch></GeoSearch>
            </Row>
          </Col>
          <Col xs={12} md={4} className="border">
            <Row className="justify-content-center align-items-center">
              <SearchBox></SearchBox>
            </Row>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col xs={12} className="border">
            <Button type="button" variant="primary" className="m-3">
              Reset Filters
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
                    <Service key={service._id} service={service} />
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
