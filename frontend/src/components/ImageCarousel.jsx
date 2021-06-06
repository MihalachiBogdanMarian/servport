import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const ImageCarousel = ({ images }) => {
  return (
    <Carousel dynamicHeight={false} showStatus={false}>
      {images.map((image) => (
        <div key={image}>
          <img alt="Service offer" src={process.env.REACT_APP_FILE_UPLOAD_PATH + image} />
        </div>
      ))}
    </Carousel>
  );
};

export default ImageCarousel;
