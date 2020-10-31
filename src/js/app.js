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
  const inputValDate = document.getElementById("date-input").value;
  const inputValTask = document.getElementById("task-input").value;
  const inputValStart = document.getElementById("start-input").value;
  const inputValEnd = document.getElementById("end-input").value;

  if (inputValDate && inputValTask && inputValStart && inputValEnd) {
    let taskList = [];
    let item = localStorage.getItem(inputValDate);

    // This date entry already exists so get the curr taskList
    if (item) {
      item = JSON.parse(item);
      taskList = item.taskList;
    }

    taskList.push({
      task: inputValTask,
      start: inputValStart,
      end: inputValEnd,
    });

    populateList(inputValDate, taskList, false);
    addToStorage(inputValDate, taskList);
    resetFields();
  } else {
    alert("Please fill out all input fields.");
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
    taskHtml += `<p class="task"> ${item.task} </p> 
            <span class="start-time">Start: ${item.start} </span> 
            <span class="end-time">End: ${item.end} </span>`;
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
  document.getElementById("start-input").value = "";
  document.getElementById("end-input").value = "";
};
