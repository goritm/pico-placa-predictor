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

export { restrictedDays, limitHours, calculateMinutesSinceMidnight };
