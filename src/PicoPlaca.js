import * as React from "react";
import Datetime from "react-datetime";
import {
  licensePlateCanDrive,
  validateLicenseAndDate,
  reducer,
  initialState,
} from "./utils";

const PicoPlaca = () => {
  const [
    { licensePlate, dateTime, isAllowed, isSubmitted, errorMsg },
    dispatch,
  ] = React.useReducer(reducer, initialState);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateLicenseAndDate(licensePlate, dateTime, dispatch)) {
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
          <h4>{`NUMBER PLATE ${licensePlate} CAN${
            !isAllowed ? "NOT" : ""
          } DRIVE AT ${dateTime.format("MM/DD, HH:mm")}`}</h4>
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
