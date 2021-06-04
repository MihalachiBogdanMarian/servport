import React from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

const Home = ({ history }) => {
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const { userDetails } = loggedInUser;

  if (userDetails) {
    return <Redirect to="profile" />;
  }

  return (
    <section className="home">
      <div className="dark-overlay">
        <div className="home-inner">
          <h1 className="home-h1">Services Portal</h1>
          <p className="home-p">Post service offers, search for service offers, expand your business</p>
          <div className="buttons">
            <button
              className="home-button"
              onClick={() => history.push("/services/page/1/category/Services>Auto %26 Transportation>Car Services")}
            >
              Services
            </button>
            <button className="home-button" onClick={() => history.push("/register")}>
              Sign Up
            </button>
            <button className="home-button" onClick={() => history.push("/login")}>
              Login
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
