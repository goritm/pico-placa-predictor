// basic utils
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

// main logic
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
  if (selectedDay === restrictedDays[lastDigit] && getRestrictedHours(dateTime))
    return false;
  return true;
};

const submitValues = (licensePlate, dateTime, dispatch) => {
  // values validation
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
    // values are validated, so we can submit them
    const lastDigit = parseInt(licensePlate.slice(-1));
    dispatch({
      type: "SUBMIT",
      payload: licensePlateCanDrive(lastDigit, dateTime),
    });
  }
};

// useReducer arguments
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
      return { ...state, dateTime: action.payload, isSubmitted: false };
    case "ERROR":
      return { ...state, errorMsg: action.payload };
    default:
      return { ...state, errorMsg: "this should not happen" };
  }
};

const initialState = {
  licensePlate: "",
  errorMsg: "",
  dateTime: null,
  isAllowed: false,
  isSubmitted: false,
};

export { submitValues, reducer, initialState };
