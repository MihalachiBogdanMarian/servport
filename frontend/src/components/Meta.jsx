import React from "react";
import { Helmet } from "react-helmet";

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keyword" content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "Welcome To ServPort",
  description: "We offer a wide range of services",
  keywords:
    "auto, transport, constructions, installations, interior design, roofs, cleaning, decorations, photo, lessons, repairs",
};

export default Meta;
