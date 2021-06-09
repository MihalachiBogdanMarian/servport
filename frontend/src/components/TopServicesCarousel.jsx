import React, { useEffect } from "react";
import { Carousel, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getTopRatedServicesPerCategory } from "../actions/service";
import Loader from "./Loader";
import Message from "./Message";

const TopServicesCarousel = ({ category }) => {
  const dispatch = useDispatch();

  const topRatedServicesStatus = useSelector((state) => state.topRatedServices);
  const { loading, error, topRatedServices } = topRatedServicesStatus;

  useEffect(() => {
    dispatch(getTopRatedServicesPerCategory(category, 3));
  }, [dispatch, category]);

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <Carousel pause="hover" className="carousel-bg-black">
      {topRatedServices.map((service) => (
        <Carousel.Item key={service._id}>
          <Link to={`/services/${service._id}`}>
            <Image src={process.env.REACT_APP_FILE_UPLOAD_PATH + service.images[0]} alt={service.title} fluid />
            <Carousel.Caption className="carousel-caption">
              <h2>
                {service.title} ({service.price.minPrice}$ - {service.price.maxPrice}$)
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default TopServicesCarousel;
