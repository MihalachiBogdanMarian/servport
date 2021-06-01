import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getServices } from "../actions/service";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Meta from "../components/Meta";
import Paginate from "../components/Paginate";
import Service from "../components/Service";

const Services = ({ match }) => {
  const pageNumber = match.params.pageNumber || 1;
  let category = match.params.category || "Services>Auto %26 Transportation>Car Services";
  category = category.replace("&", "%26");

  const [filters, setFilters] = useState([]);

  const dispatch = useDispatch();

  const servicesList = useSelector((state) => state.servicesList);
  const { loading, error, services, pages, page } = servicesList;

  useEffect(() => {
    dispatch(getServices(category, pageNumber, filters));
  }, [dispatch, category, pageNumber, filters]);

  return (
    <Container>
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
              <Paginate pages={pages} page={page} />
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Services;
