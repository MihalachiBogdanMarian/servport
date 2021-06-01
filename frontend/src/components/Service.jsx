import React from "react";
import { Link } from "react-router-dom";
import formatDate from "../utils/formatDate";

const Service = ({ service }) => {
  const addresses = service.addresses.map((address) => address.replace(", ", " (") + ")");

  const addressesString =
    service.addresses && service.addresses.length < 4
      ? addresses.join(", ")
      : addresses.slice(0, 3).join(", ") + "and more...";

  return (
    <div className="card mb-3 service-card">
      <div className="row g-0">
        <div className="col-md-4">
          <Link to={`/services/${service._id}`}>
            <img
              src={process.env.REACT_APP_FILE_UPLOAD_PATH + service.images[0]}
              alt={service.title}
              className="img-fluid"
            />
          </Link>
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <Link to={`/services/${service._id}`}>
              <h5 className="card-title">{service.title}</h5>
            </Link>
            <p className="card-text">Provisioning locations: {addressesString}</p>
            <p className="card-text">
              Prices between: {service.price.minPrice}$ - {service.price.maxPrice}$
            </p>
            <p className="card-text">
              <small className="text-muted">Posted at: {formatDate(service.createdAt)}</small>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Service;
