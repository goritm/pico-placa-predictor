import * as React from "react";
import Datetime from "react-datetime";
import { submitValues, reducer, initialState } from "./utils";
import Input from "./Input";

const PicoPlaca = () => {
  const [
    { licensePlate, dateTime, isAllowed, isSubmitted, errorMsg },
    dispatch,
  ] = React.useReducer(reducer, initialState);

  const handleSubmit = (event) => {
    event.preventDefault();
    submitValues(licensePlate, dateTime, dispatch);
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
        <Input license={licensePlate} dispatch={dispatch} />
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
