// Update Unchecked Count
function updateUncheckedCount() {
  uncheckedCount = 0;
  const lis = document.getElementsByTagName("li");

  for (let i = 0; i < lis.length; i++) {
    if (!lis[i].classList.contains("compleat")) {
      uncheckedCount++;
    }
  }

  count.innerHTML = uncheckedCount;
}

// Make The LISTS
const button = document.querySelector(".button");
const inputElement = document.querySelector("#myInput");
const list = document.querySelector("ul");
let count = document.querySelector(".numper");
let uncheckedCount = 0;
let draggedItem = null;

function addListItem(event) {
  event.preventDefault();

  const inputValue = inputElement.value.trim();
  if (inputValue === "") {
    return;
  }

  const liElement = document.createElement("li");
  liElement.textContent = inputValue;
  liElement.draggable = true;

  // Determine if the "compleat" section is active
  const compleatSectionActive = document.getElementById("compleat").classList.contains('Active');

  // Set the display style based on the "compleat" section state
  liElement.style.display = compleatSectionActive ? "none" : "";


  const spanCheck = createIconSpan("check", "./images/icon-check.svg");
  const spanCross = createIconSpan("cross", "./images/icon-cross.svg");

  liElement.appendChild(spanCheck);
  liElement.appendChild(spanCross);

  list.appendChild(liElement);
  inputElement.value = "";

  // Attach event listeners to the newly created list item
  attachEventListenersToListItem(liElement);

  uncheckedCount++;

  if (compleatSectionActive) {
    liElement.style.display = "none"; // Hide the new li if compleat section is active
  }

  updateUncheckedCount();
  saveToLocalStorage(); // Save the new item to local storage
}

function createIconSpan(className, imagePath) {
  const span = document.createElement("span");
  span.className = className;

  const img = document.createElement("img");
  img.src = imagePath;
  img.alt = "";

  span.appendChild(img);
  return span;
}

function attachEventListenersToListItem(liElement) {
  const spanCheck = liElement.querySelector(".check");
  const spanCross = liElement.querySelector(".cross");

  spanCheck.addEventListener("click", function () {
    liElement.classList.toggle("checked");
    liElement.classList.toggle("done");
    liElement.classList.toggle("compleat");
    updateUncheckedCount();
    saveToLocalStorage();
  });

  spanCross.addEventListener("click", function () {
    liElement.remove();
    updateUncheckedCount();
    saveToLocalStorage();
  });

  liElement.addEventListener("dragstart", dragStart);
  liElement.addEventListener("dragover", dragOver);
  liElement.addEventListener("dragenter", dragEnter);
  liElement.addEventListener("dragleave", dragLeave);
  liElement.addEventListener("drop", drop);
  liElement.addEventListener("dragend", dragEnd);
}

function dragStart(event) {
  draggedItem = this;
  this.classList.add("dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/html", this.innerHTML);
}

function dragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
}

function dragEnter(event) {
  event.preventDefault();
  this.classList.add("drag-over");
}

function dragLeave() {
  this.classList.remove("drag-over");
}

function drop(event) {
  if (draggedItem === this) {
    return;
  }
  this.parentNode.insertBefore(draggedItem, this);
}

function dragEnd() {
  draggedItem.classList.remove("dragging");
  const dragOverItems = document.querySelectorAll(".drag-over");
  dragOverItems.forEach((item) => item.classList.remove("drag-over"));
}

button.addEventListener("click", addListItem);

inputElement.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    addListItem(event);
  }
});

list.addEventListener("click", function (event) {
  if (event.target.classList.contains("cross")) {
    event.target.parentNode.remove();
    updateUncheckedCount();
    saveToLocalStorage(); // Save changes to local storage
  }
});

// Set the Filters
function setupEventListeners() {
  let filters = document.getElementsByClassName("filter");

  for (let i = 0; i < filters.length; i++) {
    filters[i].addEventListener("click", function () {
      for (let j = 0; j < filters.length; j++) {
        filters[j].classList.remove("Active");
      }
      this.classList.add("Active");

      // Handle the filter options
      if (this.id === "all") {
        showAllItems();
      } else if (this.id === "active") {
        showActiveItems();
      } else if (this.id === "compleat") {
        showCompleatItems();
      }
    });
  }

  let clear = document.getElementById("clear");
  clear.addEventListener("click", function () {
    let lis = document.getElementsByTagName("li");
    let lisToRemove = [];

    for (let i = 0; i < lis.length; i++) {
      if (lis[i].classList.contains("compleat")) {
        lisToRemove.push(lis[i]);
      }
    }

    for (let i = 0; i < lisToRemove.length; i++) {
      lisToRemove[i].remove();
      updateUncheckedCount();
      saveToLocalStorage(); // Save changes to local storage
    }
  });
}
function showAllItems() {
  let lis = document.getElementsByTagName("li");
  for (let i = 0; i < lis.length; i++) {
    lis[i].style.display = "block";
  }
}
function showActiveItems() {
  let lis = document.getElementsByTagName("li");
  for (let i = 0; i < lis.length; i++) {
    if (lis[i].classList.contains("compleat")) {
      lis[i].style.display = "none";
    } else {
      lis[i].style.display = "block";
    }
  }
}
function showCompleatItems() {
  let lis = document.getElementsByTagName("li");
  for (let i = 0; i < lis.length; i++) {
    if (lis[i].classList.contains("compleat")) {
      lis[i].style.display = "block"; // Show the checked items
    } else {
      lis[i].style.display = "none";
    }
  }
}


function saveToLocalStorage() {
  const lis = document.getElementsByTagName("li");
  const items = [];

  for (let i = 0; i < lis.length; i++) {
    const text = lis[i].textContent;
    const isCompleat = lis[i].classList.contains("compleat");
    items.push({ text, isCompleat });
  }

  localStorage.setItem("todoList", JSON.stringify(items));
}

function loadFromLocalStorage() {
  const storedData = localStorage.getItem("todoList");
  if (storedData) {
    const items = JSON.parse(storedData);

    for (const item of items) {
      const liElement = document.createElement("li");
      liElement.textContent = item.text;
      liElement.draggable = true;

      // Add the "compleat" class and hide the item if it's completed
      if (item.isCompleat) {
        liElement.classList.add("compleat");
        liElement.classList.add("checked"); // Set the "checked" class for completed items
        liElement.style.display = "none";
      }

      const spanCheck = createIconSpan("check", "./images/icon-check.svg");
      const spanCross = createIconSpan("cross", "./images/icon-cross.svg");

      liElement.appendChild(spanCheck);
      liElement.appendChild(spanCross);

      list.appendChild(liElement);

      // Attach event listeners to the newly created list item
      attachEventListenersToListItem(liElement);

      updateUncheckedCount();
    }
  }
}


// Call this when the page loads
window.addEventListener("load", function () {
  loadFromLocalStorage();
});

setupEventListeners();
