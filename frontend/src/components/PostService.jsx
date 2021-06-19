import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Select } from "react-functional-select";
import { useDispatch, useSelector } from "react-redux";
import { postServiceOffer } from "../actions/service";
import { SERVICE_POST_RESET } from "../constants/service";
import AddressesFormControl from "./AddressesFormControl";
import AvailabilityPeriodsFormControl from "./AvailabilityPeriodsFormControl";
import Loader from "./Loader";
import Message from "./Message";

const categoryOptions = [
  { value: "Services>Auto & Transportation>Car Services", label: "Auto" },
  { value: "Services>Auto & Transportation>Transport Services", label: "Transport" },
  { value: "Services>Craftsmen & Builders>Constructions", label: "Constructions" },
  { value: "Services>Craftsmen & Builders>Sanitary, Thermal, AC Installations", label: "Installations" },
  { value: "Services>Craftsmen & Builders>Interior Design", label: "Interior Design" },
  { value: "Services>Craftsmen & Builders>Roofs", label: "Roofs" },
  { value: "Services>Cleaning", label: "Cleaning" },
  { value: "Services>Events>Floral Arrangements & Decorations", label: "Decorations" },
  { value: "Services>Events>Photo & Video", label: "Photo" },
  { value: "Services>Private Lessons", label: "Private Lessons" },
  { value: "Services>Repairs: PC, Electronics, Home Appliances", label: "Repairs" },
];

const themeConfig = {
  select: {
    css: "margin-bottom: 3rem",
  },
};

const PostService = ({ history }) => {
  const selectRef = useRef(null);

  const dispatch = useDispatch();

  const postedService = useSelector((state) => state.postedService);
  const { loading, error, success, service } = postedService;

  const [price, setPrice] = useState({ minPrice: null, maxPrice: null });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categoryOptions[0]);
  const [addresses, setAddresses] = useState([]);
  const [availabilityPeriods, setAvailabilityPeriods] = useState([]);
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());
  const [startTime, setStartTime] = useState(new Date(0, 0, 0, 24, 0));
  const [endTime, setEndTime] = useState(new Date(0, 0, 0, 23, 59));

  const getOptionValue = useCallback((option) => option.value, []);
  const getOptionLabel = useCallback((option) => option.label, []);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      postServiceOffer(
        title,
        description,
        category.value,
        price,
        availabilityPeriods,
        addresses.map((address) => address.text)
      )
    );
  };

  useEffect(() => {
    if (success) {
      history.push(`/services/${service._id}`);
      dispatch({ type: SERVICE_POST_RESET });
    }
  }, [history, dispatch, success, service]);

  return (
    <>
      <h1>Post Service Offer</h1>
      <hr></hr>
      <br></br>
      <Container>
        <Row className="justify-content-md-center">
          <Col>
            {loading && <Loader />}
            {error && <Message variant="danger">{error}</Message>}
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  row="5"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <label htmlFor="minPrice" className="form-label">
                Minimum Price
              </label>
              <div className="input-group mb-3">
                <input
                  type="text"
                  id="minPrice"
                  className="form-control"
                  placeholder="Enter min price"
                  aria-label="Dollar amount (with dot and two decimal places)"
                  onChange={(e) => setPrice({ ...price, minPrice: parseFloat(e.target.value) })}
                />
                <span className="input-group-text">$</span>
                <span className="input-group-text">0.00</span>
              </div>

              <label htmlFor="maxPrice" className="form-label">
                Maximum Price
              </label>
              <div className="input-group mb-3">
                <input
                  type="text"
                  id="maxPrice"
                  className="form-control"
                  placeholder="Enter max price"
                  aria-label="Dollar amount (with dot and two decimal places)"
                  onChange={(e) => setPrice({ ...price, maxPrice: parseFloat(e.target.value) })}
                />
                <span className="input-group-text">$</span>
                <span className="input-group-text">0.00</span>
              </div>

              <label htmlFor="category" className="form-label">
                Category
              </label>
              <Select
                ref={selectRef}
                options={categoryOptions}
                getOptionValue={getOptionValue}
                getOptionLabel={getOptionLabel}
                initialValue={categoryOptions[0]}
                onOptionChange={setCategory}
                themeConfig={themeConfig}
              />

              <AddressesFormControl addresses={addresses} setAddresses={setAddresses}></AddressesFormControl>

              <br></br>
              <br></br>
              <br></br>
              <AvailabilityPeriodsFormControl
                availabilityPeriods={availabilityPeriods}
                setAvailabilityPeriods={setAvailabilityPeriods}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                startTime={startTime}
                setStartTime={setStartTime}
                endTime={endTime}
                setEndTime={setEndTime}
              ></AvailabilityPeriodsFormControl>

              <br></br>
              <br></br>
              <Button type="submit" variant="primary">
                Post
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PostService;
