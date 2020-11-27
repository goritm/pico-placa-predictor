import * as React from "react";
import Datetime from "react-datetime";
import {
  restrictedDays,
  limitHours,
  calculateMinutesSinceMidnight,
} from "./utils";

const initialState = {
  licensePlate: "",
  errorMsg: "",
  dateTime: null,
  isAllowed: false,
  isSubmitted: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SUBMIT":
      return {
        ...state,
        errorMsg: "",
        isAllowed: action.payload,
        isSubmitted: true,
      };
    case "LICENSE":
      return { ...state, licensePlate: action.payload, isSubmitted: false };
    case "DATETIME":
      return { ...state, dateTime: action.payload };
    case "ERROR":
      return { ...state, errorMsg: action.payload };
    default:
      return { ...state, errorMsg: "this should not happen" };
  }
};

const PicoPlaca = () => {
  const [
    { licensePlate, dateTime, isAllowed, isSubmitted, errorMsg },
    dispatch,
  ] = React.useReducer(reducer, initialState);

  const getRestrictedHours = (dateTime) => {
    const hoursOfTheDay = dateTime.hour();
    const minutesOfTheDay = dateTime.minutes();
    const msm = calculateMinutesSinceMidnight(hoursOfTheDay, minutesOfTheDay);
    // we get the minutes since midnight of the given time to get the restricted hours
    if (
      (msm >= limitHours.amStart && msm <= limitHours.amEnd) ||
      (msm >= limitHours.pmStart && msm <= limitHours.pmEnd)
    )
      return true;
    return false;
  };

  const licensePlateCanDrive = (lastDigit, dateTime) => {
    const selectedDay = dateTime.day();
    if (
      selectedDay === restrictedDays[lastDigit] &&
      getRestrictedHours(dateTime)
    )
      return false;
    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!licensePlate) {
      dispatch({ type: "ERROR", payload: "Enter a license plate number" });
    } else if (
      licensePlate.length !== 7 ||
      licensePlate.substr(0, 3).match(/\d/) ||
      isNaN(licensePlate.substr(3, 4))
    ) {
      dispatch({
        type: "ERROR",
        payload: "Enter a valid license plate number e.g. ABC1234",
      });
    } else if (!dateTime) {
      dispatch({ type: "ERROR", payload: "Select a date and time" });
    } else {
      const lastDigit = parseInt(licensePlate.slice(-1));
      dispatch({
        type: "SUBMIT",
        payload: licensePlateCanDrive(lastDigit, dateTime),
      });
    }
  };

  return (
    <section>
      <form className="form-container" onSubmit={handleSubmit}>
        <h3>Pico & Placa Predictor</h3>
        {errorMsg && (
          <p role="alert" style={{ color: "red" }}>
            {errorMsg}
          </p>
        )}
        {isSubmitted && (
          <h4>{`LICENSE PLATE NUMBER ${licensePlate} CAN${
            !isAllowed ? "NOT" : ""
          } DRIVE!`}</h4>
        )}
        <input
          className="licenseInput"
          type="text"
          placeholder="ABC1234"
          value={licensePlate.toUpperCase()}
          onChange={({ target: { value } }) => {
            if (value.length > 7) return;
            return dispatch({ type: "LICENSE", payload: value });
          }}
        />
        <Datetime
          input={false}
          value={dateTime}
          onChange={(dateTime) =>
            dispatch({ type: "DATETIME", payload: dateTime })
          }
        />
        <button className="btn" type="submit">
          check if you can drive
        </button>
      </form>
    </section>
  );
};

export default PicoPlaca;
