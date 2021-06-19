import React from "react";
import { useSelector } from "react-redux";

const Scheduler = () => {
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const { userDetails } = loggedInUser;

  const events = userDetails.schedules.map((schedule) => {
    return {
      id: schedule._id,
      title: schedule.title + " - " + schedule.executionAddress,
      start: schedule.availabilityPeriod.startTime,
      end: schedule.availabilityPeriod.endTime,
    };
  });

  return (
    <>
      <h1>Your Scheduler</h1>
      <hr></hr>
      <br></br>
      <div className="scheduler-container"></div>
    </>
  );
};

export default Scheduler;
