window.addEventListener("load", () => {
    // ToDo change form class to id
    const toggleButton: HTMLElement = <HTMLElement>document.getElementsByClassName("toggleButton")[0];
    const navBarLinks: HTMLElement = <HTMLElement>document.getElementsByClassName("navBarLinks")[0];

    toggleButton.addEventListener("click", () => {
        navBarLinks.classList.toggle("active");
    });
});