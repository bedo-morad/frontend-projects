//TODO: let player choose the number of tries and letters
//setting game name
let gameName = "AstroWord";
document.title = gameName;
document.querySelector("footer").innerHTML = `${gameName} created by bedo &copy; ${new Date().getFullYear()}`
//splash screen
const splashScreen = document.querySelector(".splash-screen");
const startButton = document.querySelector(".splash-button");
startButton.addEventListener("click", () => {
    splashScreen.style.transition = 'opacity 1s ease-in-out';
    splashScreen.style.opacity = 0;
    setTimeout(function () {
        splashScreen.style.display = 'none';
    }, 1000);
});

//dark mode
// target the button using the data attribute we added earlier
const button = document.querySelector(".mode-changer");

button.addEventListener("click", () => {
    // get the current theme from the body
    const currentTheme = document.querySelector("html").getAttribute("data-theme");

    // switch the theme based on the current value of the data-theme attribute
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    // update the button icon
    document.querySelector(".mode-icon").src = newTheme === "dark" ? "assets/light_mode_icon.svg" : "assets/dark_mode_icon.svg";

    // update theme attribute on HTML to switch theme in CSS
    document.querySelector("html").setAttribute("data-theme", newTheme);
});

//setting game options
let numberOfTries = 6;
let numberOfLetters = 6;
let currentTry = 1;
let numberOfHints = 2;

//managing game state
let wordToGuess = "";
let messageArea = document.querySelector(".message");

//generate words with 6 letters only
async function fetchWords() {
    let response = await fetch('https://api.datamuse.com/words?ml=ringing+in+the+ears&sp=??????&max=100');
    let data = await response.json();
    return data
        .map(wordObj => wordObj.word.toUpperCase())
        .filter(word => word !== '??????');// filter out '??????'
}

//manage Hints
document.querySelector('.hint span').innerHTML = numberOfHints;
const getHintButton = document.querySelector('.hint');
getHintButton.addEventListener('click', getHint);

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
        })
    })
}

const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuess);

function handleGuess() {
    //TODO: check if the user entered all the letters
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
    //check if the user won or lost
    if (successGuess) {
        messageArea.innerHTML = `you won in ${currentTry} tries and the word is <span>${wordToGuess}</span>`;
        if (numberOfHints === 2) {
            messageArea.innerHTML = `you won in ${currentTry} tries, and the word is <span>${wordToGuess}</span>, and you didn't use any hints`;
        }
        //add disabled class to all inputs
        let allTries = document.querySelectorAll(".inputs > div");
        allTries.forEach((tryDiv) => {
            tryDiv.classList.add("disabled-inputs");
        })
        //disable the guess and hint button
        guessButton.disabled = true;
        getHintButton.disabled = true;
    } else {
        document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs");
        const currentTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        currentTryInputs.forEach((input) => {
            input.disabled = true;
        })

        currentTry++;

        const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        nextTryInputs.forEach((input) => {
            input.disabled = false;
        })

        let element = document.querySelector(`.try-${currentTry}`);
        if (element) {
            document.querySelector(`.try-${currentTry}`).classList.remove("disabled-inputs");
            element.children[1].focus();
        } else {
            messageArea.innerHTML = `you lost the word is <span>${wordToGuess}</span>`;
            guessButton.disabled = true;
            getHintButton.disabled = true;
            //TODO: add play again button
        }
    }
}

function getHint() {
    if (numberOfHints > 0) {
        numberOfHints--;
        document.querySelector('.hint span').innerHTML = numberOfHints;
    }
    if (numberOfHints === 0) {
        getHintButton.disabled = true;
    }
    const enabledInputs = document.querySelectorAll("input:not([disabled])");
    const emptyEnabledInputs = Array.from(enabledInputs).filter(input => input.value === "");

    if (emptyEnabledInputs.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
        const randomInput = emptyEnabledInputs[randomIndex];
        const indexOfFill = Array.from(enabledInputs).indexOf(randomInput);
        if (indexOfFill !== -1) {
            randomInput.value = wordToGuess[indexOfFill].toUpperCase();
        }
    }
}

function handleBackspaceAndEnter(event) {
    if (event.key === "Backspace") {
        const inputs = document.querySelectorAll("input:not([disabled])");
        const currentIndex = Array.from(inputs).indexOf(document.activeElement);
        if (currentIndex > 0) {
            const currentInput = inputs[currentIndex];
            const previousInput = inputs[currentIndex - 1];
            currentInput.value = "";
            previousInput.value = "";
            previousInput.focus();
        }
    }
    if (event.key === "Enter") {
        handleGuess();
    }
}

document.addEventListener("keydown", handleBackspaceAndEnter);

window.onload = async function () {
    const words = await fetchWords();
    console.log(words);
    wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase()
    console.log(wordToGuess);
    generateInput();
}