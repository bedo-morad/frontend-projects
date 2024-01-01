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
let numberOfTries = 6;
let numberOfLetters = 6;
let currentTry = 1;

let wordToGuess = "";
//generate words with 6 letters only
async function fetchWords() {
    let response = await fetch('https://api.datamuse.com/words?ml=ringing+in+the+ears&sp=??????&max=100');
    let data = await response.json();
    return data
        .map(wordObj => wordObj.word.toUpperCase())
        .filter(word => word !== '??????');// filter out '??????'
}

function generateInput() {
    const inputsContainer = document.querySelector(".inputs");

    //create main try div
    for (let i = 1; i <= numberOfTries; i++) {
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
    //focus on the first input in the first try
    inputsContainer.children[0].children[1].focus();

    //Disable all inputs except the first one
    const inputsInDisabledDiv = document.querySelectorAll(".disabled-inputs input");
    inputsInDisabledDiv.forEach((input) => {
        input.disabled = true;
    })

    const inputs = document.querySelectorAll("input");
    inputs.forEach((input, index) => {
        //convert all input to uppercase
        input.addEventListener("input", function () {
            this.value = this.value.toUpperCase();
            const nextInput = inputs[index + 1];
            if (nextInput) {
                nextInput.focus();
            }
        })

        input.addEventListener("keydown", function (event) {
            const currentIndex = Array.from(inputs).indexOf(event.target);
            if (event.key === "ArrowRight") {
                const nextInput = currentIndex + 1;
                if (nextInput < inputs.length) {
                    inputs[nextInput].focus();
                }
            }
            if (event.key === "ArrowLeft") {
                const previousInput = currentIndex - 1;
                if (previousInput >= 0) {
                    inputs[previousInput].focus();
                }
            }
            if (event.key === "Backspace" || event.key === "Delete") {
                this.value = "";
            }
        })
    })
}

const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuess);

function handleGuess() {
    let successGuess = true;
    for (let i = 1; i <= numberOfLetters; i++) {
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        const letter = inputField.value.toLowerCase();
        const actualLetter = wordToGuess[i - 1];

        //game logic
        //the letter is correct and in the right place
        if (letter === actualLetter) {
            inputField.classList.add("yes-in-place");
        }
        //the letter is correct but in the wrong place
        else if (wordToGuess.includes(letter)) {
            inputField.classList.add("not-in-place");
            successGuess = false;
        }
        //the letter is wrong
        else {
            inputField.classList.add("no");
            successGuess = false;
        }
    }
}

window.onload = async function () {
    const words = await fetchWords();
    console.log(words);
    wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase()
    console.log(wordToGuess);
    generateInput();
}