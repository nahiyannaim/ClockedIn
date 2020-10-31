const printLatest = () => {
  console.log(localStorage);
  getAllDates();
};

const getAllDates = () => {
  Object.entries(localStorage).forEach((entry) => {
    const taskList = JSON.parse(entry[1]).taskList;
    console.log(convertDate(entry[0]));
  });
};

const convertDate = (date) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const result = new Date(date);

  return `${days[result.getUTCDay()]}, ${result.getUTCDate()} ${
    months[result.getUTCMonth()]
  } ${result.getUTCFullYear()}`;
};
