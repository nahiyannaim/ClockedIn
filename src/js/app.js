// Add a new entry on click
// To-Do: change add to use mock DB
const addEntry = () => {
  const li = document.createElement("li");
  const inputValDate = document.getElementById("date-input").value;
  const text = document.createTextNode(inputValDate);
  const span = document.createElement("span");

  li.appendChild(text);

  if (inputValDate === "") {
    console.log("Please fill in the fields");
  } else {
    document.getElementById("list").appendChild(li);
    span.className = "remove-btn";
    span.innerHTML = "X";
    li.appendChild(span);
    document.getElementById("date-input").value = "";
  }

  for (let i = 0; i < remove.length; i++) {
    remove[i].onclick = function () {
      this.parentElement.style.display = "none";
    };
  }
};

// Click on X to hide entry
// To-Do: replace hide with remove from mock DB
const remove = document.getElementsByClassName("remove-btn");

for (let i = 0; i < remove.length; i++) {
  remove[i].onclick = function () {
    this.parentElement.style.display = "none";
  };
}
