import React from "react";
import { useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";

const Home = () => {
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const { userDetails } = loggedInUser;

  if (userDetails) {
    return <Redirect to="profile" />;
  }

  return (
    <section className="home">
      <div className="dark-overlay">
        <div className="home-inner">
          <h1 className="">Services Portal</h1>
          <p className="">Post service offers, search for service offers, expand your business</p>
          <div className="buttons">
            <Link to="/services/auto" className="btn btn-primary">
              Services
            </Link>
            <Link to="/register" className="btn btn-primary">
              Sign Up
            </Link>
            <Link to="/login" className="btn btn-light">
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
