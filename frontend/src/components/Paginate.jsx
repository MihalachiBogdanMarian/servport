import React from "react";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Paginate = ({
  pages,
  page,
  adminPagination = false,
  myServicesPagination = false,
  serviceCategory = "Services>Auto %26 Transportation>Car Services",
}) => {
  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((x) => {
          let path = `/services/page/${x + 1}/category/${serviceCategory}`;

          if (adminPagination) {
            path = `/admin/${adminPagination}/${x + 1}`;
          }
          if (myServicesPagination) {
            path = `/profile/myservices/page/${x + 1}`;
          }

          return (
            <LinkContainer key={x + 1} to={path}>
              <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
            </LinkContainer>
          );
        })}
      </Pagination>
    )
  );
};

export default Paginate;
