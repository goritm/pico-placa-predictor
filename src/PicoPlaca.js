import * as React from "react";
import Datetime from "react-datetime";

const restrictedDays = {
  // monday
  1: 1,
  2: 1,
  // tuesday
  3: 2,
  4: 2,
  // wednesday
  5: 3,
  6: 3,
  // thursday
  7: 4,
  8: 4,
  // friday
  9: 5,
  0: 5,
};

const limitHours = {
  amStart: 420, // 7:00am
  amEnd: 570, // 9:30am
  pmStart: 960, // 16:00pm
  pmEnd: 1170, //19:30pm
};

const calculateMinutesSinceMidnight = (hours, minutes) => hours * 60 + minutes;

const PicoPlaca = () => {
  const [licensePlate, setLicensePlate] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");
  const [dateTime, setDateTime] = React.useState(null);
  const [isAllowed, setIsAllowed] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

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
      setErrorMsg("Enter a license plate number");
    } else if (
      licensePlate.length !== 7 ||
      licensePlate.substr(0, 3).match(/\d/) ||
      isNaN(licensePlate.substr(3, 4))
    ) {
      setErrorMsg("Enter a valid license plate number e.g. ABC1234");
    } else if (!dateTime) {
      setErrorMsg("Select a date and time");
    } else {
      const lastDigit = parseInt(licensePlate.slice(-1));
      setErrorMsg("");
      setIsSubmitted(true);
      setIsAllowed(licensePlateCanDrive(lastDigit, dateTime));
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
            setIsSubmitted(false);
            return setLicensePlate(value);
          }}
        />
        <Datetime
          input={false}
          value={dateTime}
          onChange={(dateTime) => setDateTime(dateTime)}
        />
        <button className="btn" type="submit">
          check
        </button>
      </form>
    </section>
  );
};

export default PicoPlaca;
