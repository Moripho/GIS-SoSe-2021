"use strict";
window.addEventListener("load", () => {
    // ToDo change form class to id
    const toggleButton = document.getElementsByClassName("toggleButton")[0];
    const navBarLinks = document.getElementsByClassName("navBarLinks")[0];
    toggleButton.addEventListener("click", () => {
        navBarLinks.classList.toggle("active");
    });
});
//# sourceMappingURL=application.js.map