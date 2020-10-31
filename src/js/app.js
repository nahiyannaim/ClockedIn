const ul = document.getElementById("entry-list");

const start = () => {
  // Retrieve initial state of entry list from storage and display it
  Object.entries(localStorage).forEach((entry) => {
    const taskList = JSON.parse(entry[1]).taskList;

    populateList(entry[0], taskList);
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

const addToStorage = (date, newTask) => {
  let item = localStorage.getItem(date);
  let taskList = [];

  if (item) {
    // This date entry already exists
    item = JSON.parse(item);
    taskList = item.taskList;
  }

  taskList.push(newTask);
  localStorage.setItem(date, JSON.stringify({ taskList }));
};

const removeFromStorage = (date) => {
  localStorage.removeItem(date);
};

// Add a new entry on click
const addEntry = () => {
  const inputValDate = document.getElementById("date-input").value;
  const inputValTask = document.getElementById("task-input").value;
  const inputValStart = document.getElementById("start-input").value;
  const inputValEnd = document.getElementById("end-input").value;

  if (inputValDate && inputValTask && inputValStart && inputValEnd) {
    let taskList = [];
    let newTask = {
      task: inputValTask,
      start: inputValStart,
      end: inputValEnd,
    };
    taskList.push(newTask);

    populateList(inputValDate, taskList); // To-do: check if date already exists in storage
    addToStorage(inputValDate, newTask);
    resetFields();
  } else {
    console.log("Please fill out all input fields.");
  }
};

// Remove an entry on click
const removeEntry = (date) => {
  document.getElementById(date).remove();
  removeFromStorage(date);
};

const populateList = (date, taskList) => {
  const div = document.createElement("div");
  div.setAttribute("id", date);
  let taskHtml = `<div class="date"> ${date} </div>`;

  taskList.forEach((item) => {
    taskHtml += `<p class="task"> ${item.task} </p> 
            <span class="start-time">Start: ${item.start} </span> 
            <span class="end-time">End: ${item.end} </span>`;
  });

  taskHtml += `<button class="remove-entry-btn"> Remove Entry </button>`;

  div.innerHTML = taskHtml;
  ul.appendChild(div);
};

const printLatest = () => {
  console.log(localStorage);
};

const resetFields = () => {
  document.getElementById("date-input").value = "";
  document.getElementById("task-input").value = "";
  document.getElementById("start-input").value = "";
  document.getElementById("end-input").value = "";
};
