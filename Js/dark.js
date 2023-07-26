// Check if there's a previous dark mode preference in local storage
let storedDarkMode = localStorage.getItem("darkMode");
let isDarkMode = storedDarkMode === "true";

// Update the UI based on the dark mode preference
let darkModeToggle = document.querySelector(".dark-mood");
let body = document.querySelector("body");

function updateDarkModeUI() {
  if (isDarkMode) {
    darkModeToggle.src = "/images/icon-moon.svg";
    body.classList.add("light");
  } else {
    darkModeToggle.src = "/images/icon-sun.svg";
    body.classList.remove("light");
  }
}

updateDarkModeUI();

// Add click event listener to toggle dark mode
darkModeToggle.addEventListener("click", function () {
  isDarkMode = !isDarkMode;
  updateDarkModeUI();

  // Store the updated dark mode preference in local storage
  localStorage.setItem("darkMode", isDarkMode.toString());
});
