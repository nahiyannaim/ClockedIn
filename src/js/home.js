const ul = document.getElementById("entry-list");

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
  let inputValDate = document.getElementById("date-input").value;
  const inputValTask = document.getElementById("task-input").value;
  const inputValProject = document.getElementById("project-input").value;
  const inputValStart = document.getElementById("start-input").value;
  const inputValEnd = document.getElementById("end-input").value;

  if (
    inputValDate &&
    inputValTask &&
    inputValProject &&
    inputValStart &&
    inputValEnd
  ) {
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
  } else {
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
  }
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
                  <p class="task"> ${item.task} </p> 
                  <p class="project ${item.project
                    .toString()
                    .toLowerCase()
                    .replace(" ", "-")}"> ${item.project} </p>
                  <span class="start-time">Start: ${item.start} </span> 
                  <span class="end-time">End: ${item.end} </span>
                </div>`;
  });
  taskHtml += `<button class="remove-entry-btn"> Remove Entry </button>`;
  div.innerHTML = taskHtml;

  // If entry already exists replace the old div with new updated entry
  if (staleEntry) {
    staleEntry.replaceWith(div);
  } else {
    ul.appendChild(div);
  }
};

const printLatest = () => {
  console.log(localStorage);
};

const resetFields = () => {
  document.getElementById("date-input").value = "";
  document.getElementById("task-input").value = "";
  document.getElementById("project-input").value = "";
  document.getElementById("start-input").value = "";
  document.getElementById("end-input").value = "";
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
