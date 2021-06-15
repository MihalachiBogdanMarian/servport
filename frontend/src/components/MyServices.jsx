import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getMyServices } from "../actions/service";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Meta from "../components/Meta";
import Paginate from "../components/Paginate";
import ServiceCard from "../components/ServiceCard";

const MyServices = ({ match }) => {
  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const myServices = useSelector((state) => state.myServices);
  const { loading, error, services, pages, page } = myServices;

  useEffect(() => {
    dispatch(getMyServices(pageNumber));
  }, [dispatch, pageNumber]);

  return (
    <>
      <h1>Your Services</h1>
      <hr></hr>
      <br></br>
      <Container>
        <Row className="justify-content-md-center">
          <Col>
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
                <Paginate pages={pages} page={page} myServicesPagination={true} />
              </>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default MyServices;
