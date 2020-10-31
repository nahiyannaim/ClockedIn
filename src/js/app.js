const ul = document.getElementById("entry-list");

const start = () => {
  // Retrieve initial state of entry list from storage and display it
  Object.entries(localStorage).forEach((entry) => {
    const val = JSON.parse(entry[1]);
    populateList(entry[0], val.task, val.start, val.end, val.subEntries);
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

const addToStorage = (date, task, start, end, subEntries) => {
  localStorage.setItem(
    date,
    JSON.stringify({
      task: task,
      start: start,
      end: end,
      subEntries: subEntries,
    })
  );
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
  const inputValSubEntries = [];

  if (inputValDate && inputValTask && inputValStart && inputValEnd) {
    populateList(
      inputValDate,
      inputValTask,
      inputValStart,
      inputValEnd,
      inputValSubEntries
    ); // To-do: check if date already exists in storage
    addToStorage(
      inputValDate,
      inputValTask,
      inputValStart,
      inputValEnd,
      inputValSubEntries
    );
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

const populateList = (date, task, start, end, subEntries) => {
  const div = document.createElement("div");
  div.setAttribute("id", date);
  div.innerHTML = `<div class="date"> ${date} </div> 
                    <p class="task"> ${task} </p> 
                    <span class="start-time">Start: ${start} </span> 
                    <span class="end-time">End: ${end} </span>
                    <button class="remove-entry-btn"> Remove Entry </button>`;
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
