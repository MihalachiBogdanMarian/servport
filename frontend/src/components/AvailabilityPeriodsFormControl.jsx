import React from "react";
import { DatePickerRange } from "react-input-moment";
import TimePicker from "react-time-picker";
import formatDate from "../utils/formatDate";

const dateOptions1 = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour12: false,
};

const dateOptions2 = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: false,
};

const AvailabilityPeriodsFormControl = ({
  availabilityPeriods,
  setAvailabilityPeriods,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
}) => {
  const handleChange = (startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const handleDelete = (i) => {
    setAvailabilityPeriods(availabilityPeriods.filter((availabilityPeriod, index) => index !== i));
  };

  return (
    <>
      <label htmlFor="availabilityPeriods" className="form-label">
        Availability Periods
      </label>

      <div className="input-group mb-3">
        <input
          className="form-control start-date-input"
          type="text"
          value={formatDate(startDate.toDate(), dateOptions1)}
          readOnly
        />

        <TimePicker onChange={setStartTime} value={startTime} disableClock={true} />

        <input
          className="form-control end-date-input"
          type="text"
          value={formatDate(endDate.toDate(), dateOptions1)}
          readOnly
        />

        <TimePicker onChange={setEndTime} value={endTime} disableClock={true} />

        <div className="input-group-append">
          <button
            className="btn btn-success"
            type="button"
            onClick={() =>
              setAvailabilityPeriods([
                ...availabilityPeriods,
                {
                  startTime: startDate
                    .toDate()
                    .setHours(parseInt(startTime.split(":")[0]), parseInt(startTime.split(":")[1])),
                  endTime: endDate.toDate().setHours(parseInt(endTime.split(":")[0]), parseInt(endTime.split(":")[1])),
                },
              ])
            }
          >
            Add
          </button>
        </div>
      </div>

      <DatePickerRange startMoment={startDate} endMoment={endDate} onChange={handleChange} showSeconds={false} />

      <ul className="list-group availability-periods-list m-3">
        {availabilityPeriods.length !== 0 &&
          availabilityPeriods.map((availabilityPeriod, index) => (
            <li key={index} className="list-group-item availability-periods-list-item">
              {formatDate(availabilityPeriod.startTime, dateOptions2) +
                " - " +
                formatDate(availabilityPeriod.endTime, dateOptions2)}
              <button
                type="button"
                className="btn-close btn-danger remove-availability-period-button"
                aria-label="Close"
                onClick={() => handleDelete(index)}
              >
                x
              </button>
            </li>
          ))}
      </ul>
    </>
  );
};

export default AvailabilityPeriodsFormControl;
