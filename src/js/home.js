const ul = document.getElementById("entry-list");

let inputValTask = document.getElementById("task-input").value;
let inputValProject = document.getElementById("project-input").value;
let inputValDate = document.getElementById("date-input").value;
let inputValStart = "";
let inputValEnd = "";
let sec = 0;
let min = 0;
let hour = 0;
let firstRun = true;

const displayElapsedTime = () => {
  if (firstRun) {
    inputValStart = getCurrTimestamp();
    document.getElementById("start-btn").style.display = "none";
    document.getElementById("stop-btn").style.display = "inline-block";
    document.getElementById("elapsed-time").style.display = "inline-block";
    firstRun = false;
  }
  sec++;

  if (sec === 60) {
    sec = 0;
    min++;
  }
  if (min === 60) {
    min = 0;
    hour++;
  }
  document.getElementById("elapsed-time").innerHTML = `${
    hour < 10 ? "0" + hour : hour
  }:${min < 10 ? "0" + min : min}:${sec < 10 ? "0" + sec : sec}`;
};

const stop = (timer) => {
  if (timer) {
    inputValEnd = getCurrTimestamp();
    inputValTask = document.getElementById("task-input").value;
    inputValProject = document.getElementById("project-input").value;
    inputValDate = document.getElementById("date-input").value;

    if (inputValDate && inputValTask && inputValProject) {
      clearInterval(timer);
      firstRun = true;
      addEntry();
      sec = 0;
      min = 0;
      hour = 0;
      document.getElementById("start-btn").style.display = "inline-block";
      document.getElementById("stop-btn").style.display = "none";
      document.getElementById("elapsed-time").style.display = "none";
    } else {
      displayModal();
    }
  } else {
    displayModal();
  }
};

const displayModal = () => {
  const modal = document.getElementById("alert-modal");
  const span = document.getElementById("modal-close");

  modal.style.display = "block";

  // Close the modal when clicked on X
  span.onclick = function () {
    modal.style.display = "none";
  };

  // Close the modal when user clicks outside the modal
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
};

const getCurrTimestamp = () => {
  let time = new Date();
  return time.getHours() + ":" + time.getMinutes();
};

const start = () => {
  // Retrieve initial state of entry list from storage and display it
  Object.entries(localStorage).forEach((entry) => {
    const taskList = JSON.parse(entry[1]).taskList;
    populateList(entry[0], taskList, true);
  });

  // Event Listener for delete buttons for entries
  if (ul) {
    ul.addEventListener("click", (event) => {
      if (
        event.target.classList.contains("remove-entry-btn") ||
        event.target.parentElement.classList.contains("remove-entry-btn")
      ) {
        removeEntry(event.target.closest("div").id);
      }
    });
  }
};

const addToStorage = (date, taskList) => {
  localStorage.setItem(date, JSON.stringify({ taskList }));
};

const removeFromStorage = (date) => {
  localStorage.removeItem(date);
};

// Add a new entry on click
const addEntry = () => {
  inputValDate = convertDate(inputValDate);
  let taskList = [];
  let item = localStorage.getItem(inputValDate);

  // This date entry already exists so get the curr taskList
  if (item) {
    item = JSON.parse(item);
    taskList = item.taskList;
  }

  taskList.push({
    task: inputValTask,
    project: inputValProject,
    start: inputValStart,
    end: inputValEnd,
  });

  populateList(inputValDate, taskList, false);
  addToStorage(inputValDate, taskList);
  resetFields();
};

// Remove an entry on click
const removeEntry = (date) => {
  document.getElementById(date).remove();
  removeFromStorage(date);
};

const populateList = (date, taskList, initialRun) => {
  const staleEntry = initialRun ? false : document.getElementById(date);
  const div = document.createElement("div");
  div.setAttribute("id", date);

  let taskHtml = `<div class="date"> ${date} </div>`;
  taskList.forEach((item) => {
    taskHtml += `<div class="task-item">
                  <span class="task"> ${item.task} </span> 
                  <span class="project ${item.project
                    .toString()
                    .toLowerCase()
                    .replace(" ", "-")}"> ${item.project} </span>
                  <div class="times">
                    <span class="start-time"> ${item.start} </span> -
                    <span class="end-time"> ${item.end} </span>
                  </div>
                </div>`;
  });
  taskHtml += `<button class="remove-entry-btn"> &minus; </button>`;
  div.innerHTML = taskHtml;

  // If entry already exists replace the old div with new updated entry
  if (staleEntry) {
    staleEntry.replaceWith(div);
  } else {
    ul.appendChild(div);
  }
};

const resetFields = () => {
  document.getElementById("date-input").value = "";
  document.getElementById("task-input").value = "";
  document.getElementById("project-input").value = "";
  inputValStart = "";
  inputValEnd = "";
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
