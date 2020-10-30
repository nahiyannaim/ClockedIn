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

// Add a new entry on click
const addEntry = () => {
  const li = document.createElement("li");
  const inputValDate = document.getElementById("date-input").value;
  const text = document.createTextNode(inputValDate);
  const span = document.createElement("span");
  const remove = document.getElementsByClassName("remove-btn");

  li.appendChild(text);

  if (inputValDate === "") {
    console.log("Please fill in the fields");
  } else {
    document.getElementById("list").appendChild(li);
    span.className = "remove-btn";
    span.innerHTML = "X";
    li.appendChild(span);
    document.getElementById("date-input").value = "";
    addToStorage(inputValDate, "start", "end", []);
  }

  for (let i = 0; i < remove.length; i++) {
    remove[i].onclick = function () {
      this.parentElement.style.display = "none";
      removeFromStorage(this.parentElement.innerText.replace("X", ""));
    };
  }
};

// Retrieve current state of entry list from storage and display it
const getCurrList = () => {
  Object.keys(localStorage).forEach((date) => {
    const li = document.createElement("li");
    const text = document.createTextNode(date);
    const span = document.createElement("span");
    const remove = document.getElementsByClassName("remove-btn");

    li.appendChild(text);
    document.getElementById("list").appendChild(li);
    span.className = "remove-btn";
    span.innerHTML = "X";
    li.appendChild(span);
    document.getElementById("date-input").value = "";

    for (let i = 0; i < remove.length; i++) {
      remove[i].onclick = function () {
        this.parentElement.style.display = "none";
        removeFromStorage(this.parentElement.innerText.replace("X", ""));
      };
    }
  });
};

const printLatest = () => {
  console.log(localStorage);
};
