const printLatest = () => {
  console.log(localStorage);
  getAllDates();
};

const getAllDates = () => {
  Object.entries(localStorage).forEach((entry) => {
    const taskList = JSON.parse(entry[1]).taskList;
    console.log(entry[0]);
  });
};
