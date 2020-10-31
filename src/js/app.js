const ul = document.getElementById("entry-list");

const addToStorage = (date, startTime, endTime, subEntries) => {
  localStorage.setItem(
    date,
    JSON.stringify({
      start: startTime,
      end: endTime,
      "sub-entries": subEntries,
    })
  );
};

const removeFromStorage = (date) => {
  localStorage.removeItem(date);
};

const start = () => {
  // Retrieve initial state of entry list from storage and display it
  Object.keys(localStorage).forEach((date) => {
    populateList(date);
  });

  // Event Listener for delete buttons for entries
  if (ul) {
    ul.addEventListener("click", (event) => {
      if (
        event.target.classList.contains("remove-entry-btn") ||
        event.target.parentElement.classList.contains("remove-entry-btn")
      ) {
        removeEntry(event.target.closest("li").id);
      }
    });
  }
};

// Add a new entry on click
const addEntry = () => {
  const inputValDate = document.getElementById("date-input").value;
  const inputValStart = document.getElementById("start-input").value;
  const inputValEnd = document.getElementById("end-input").value;

  if (inputValDate && inputValStart && inputValEnd) {
    populateList(inputValDate); // To-do: check if date already exists in storage
    resetFields();
    addToStorage(inputValDate, inputValStart, inputValEnd, []);
  } else {
    console.log("Please fill out all input fields.");
  }
};

// Remove an entry on click
const removeEntry = (date) => {
  document.getElementById(date).remove();
  removeFromStorage(date);
};

const populateList = (date) => {
  //To-do: replace li with div
  const li = document.createElement("li");
  li.setAttribute("id", date);
  li.innerHTML = `
    <div class="item">
    ${date}
    </div>
    <button class="remove-entry-btn">
      X
    </button>
  `;
  ul.appendChild(li);
};

const printLatest = () => {
  console.log(localStorage);
};

const resetFields = () => {
  document.getElementById("date-input").value = "";
  document.getElementById("start-input").value = "";
  document.getElementById("end-input").value = "";
};
