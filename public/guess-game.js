"use strict";

(function () {

    const loginButtonEl = document.querySelector('#game-app .login-button');
    const loginUsernameEl = document.getElementById('login-username');
    const guessWordButtonEl = document.querySelector('#game-app .change-word-button');
    const guessWordInputEl = document.getElementById('to-guess-word');

    let validGuessList = {};

    const illegalUsernameHTML = `
        <p>You entered an illegal username.</p>
        <p>Please try again</p>
          `;
    const hasWonHTML = `
        <span class="have-won">
          <p>You Win the Game!</p>
          <p>You can start a new game</p>
        </span>
        `;
    const emptyInputHTML = `
        <p>Input cannot be empty</p>
        `;
    const invalidInputInfoHTML = `
         <p>Your guess is not acceptable.</p>
         <p>Please try again</p>
        `;

    getValidGuessList();
    disableLoginButtonIfNoInput();
    disableSubmitIfInputIsInvalid();
    hasWon();

    render();

    function render() {
        if (loginButtonEl) {
            loginButtonEl.disabled = !loginUsernameEl.value;
        }
        if (guessWordButtonEl) {
            if (hasWon()) {
                guessWordInfoEl.innerHTML = hasWonHTML;
                guessWordButtonEl.disabled = true;
            } else {
                guessWordButtonEl.disabled = !guessWordInputEl.value;
            }
        }
    }

    function disableLoginButtonIfNoInput() {
        if (!loginButtonEl) {
            return;
        }

        const loginErrorInfoEl = document.querySelector('#game-app .login-input-error-info');
        loginUsernameEl.addEventListener('input', () => {
            const usernameRex = /^[/\da-zA-Z]+$/;
            if (loginUsernameEl.value && loginUsernameEl.value !== "dog" && usernameRex.test(loginUsernameEl.value)) {
                loginErrorInfoEl.innerHTML = ``;
                loginButtonEl.disabled = false;
            } else if (!loginUsernameEl.value) {
                loginButtonEl.disabled = true;
                loginUsernameEl.addEventListener('blur', () => {
                    loginErrorInfoEl.innerHTML = emptyInputHTML;
                });
            } else {
                loginButtonEl.disabled = true;
                loginUsernameEl.addEventListener('blur', () => {
                    loginErrorInfoEl.innerHTML = illegalUsernameHTML;
                });
            }
        });
    }

    function disableSubmitIfInputIsInvalid() {
        if (!guessWordButtonEl) {
            return;
        }

        const guessWordInfoEl = document.querySelector('#game-app .input-info');

        getValidGuessList();
        if (hasWon()) {
            guessWordInfoEl.innerHTML = hasWonHTML;
            guessWordButtonEl.disabled = true;
        }

        guessWordInputEl.addEventListener("input", () => {
            if (!guessWordInputEl.value) {
                guessWordButtonEl.disabled = true;
                guessWordInputEl.addEventListener("blur", () => {
                    guessWordInfoEl.innerHTML = emptyInputHTML;
                });
            } else if (!validGuessList[guessWordInputEl.value.toLowerCase()]) {
                guessWordButtonEl.disabled = true;
                guessWordInputEl.addEventListener("blur", () => {
                    guessWordInfoEl.innerHTML = invalidInputInfoHTML;
                });
            } else {
                guessWordButtonEl.disabled = false;
                guessWordInfoEl.innerHTML = ``;
            }
        });
    }

    function getValidGuessList() {
        if (!guessWordButtonEl) {
            return;
        }
        const validGuessWords = document.getElementById('valid-guess-words').innerText;
        const wordList = validGuessWords.split(/[\s\n]+/).filter(item => !!item);
        for (let word of wordList) {
            validGuessList[word] = word;
        }
    }

    function hasWon() {
        if (!guessWordButtonEl) {
            return;
        }
        const guessResult = document.getElementById('result').dataset.guessResult;
        return guessResult === "You Win!";
    }
})();