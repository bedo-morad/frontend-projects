//setting game name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector("footer").innerHTML = `${gameName} created by bedo &copy; ${new Date().getFullYear()}`

//dark mode
// target the button using the data attribute we added earlier
const button = document.querySelector(".mode-changer");

button.addEventListener("click", () => {
    // get the current theme from the body
    const currentTheme = document.querySelector("html").getAttribute("data-theme");

    // switch the theme based on the current value of the data-theme attribute
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    // update the button text
    button.innerText = newTheme === "dark" ? "Change to light theme" : "Change to dark theme";

    // update theme attribute on HTML to switch theme in CSS
    document.querySelector("html").setAttribute("data-theme", newTheme);
});

//setting game options
let numberOfTries = 5;
let numberOfLetters = 6;
let currentTry = 1;

function generateInput() {
    const inputsContainer = document.querySelector(".inputs");

    //create main try div
    for (let i = 1; i <= numberOfTries ; i++) {
        const tryDiv = document.createElement("div");
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span>Try ${i}</span>`;

        if (i !== 1) {
            tryDiv.classList.add("disabled-inputs");
        }
        //create inputs
        for (let j = 1; j <= numberOfLetters; j++) {
            const input = document.createElement("input");
            input.type = "text";
            input.id = `guess-${i}-letter-${j}`;
            input.setAttribute("maxlength", "1");
            tryDiv.appendChild(input);
        }
        inputsContainer.appendChild(tryDiv);
    }
    inputsContainer.children[0].children[1].focus();
}

window.onload = function () {
    generateInput();
}