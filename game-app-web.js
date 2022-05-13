const userInfo = require("./user-info.js");

const gameAppWeb = {
    loginPage: function (sid) {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
 <title>Word Guessing</title>
 <link rel="stylesheet" href="app.css">
</head>
<body>
 <div id="game-app">
 <ul class="display-panel">
   ${gameAppWeb.getLogin(sid)}
   </ul>
 </div>
 <script src="guess-game.js"></script>
</body>
</html>
        `;
    },

    getLogin: function (sid) {
        if (sid === "bad username") {
            return `
            <span class="login-error">
              <p>You entered an illegal username.</p>
              <p>Go back to <a href='/'>Home Page</a></p>
            </span>
            `;
        } else if (sid === "expired session") {
            return `
                <span class="login-panel">
                <p class="expired-session-error">Your session is expired, please login again</p>
                 <h1>Login</h1>
                 <form id="login-form" action="/login" method="POST">
                   <label><span>Username: </span><input id="login-username" name="username"</label>
                   <button class="login-button" type="submit">Login</button>
                 </form>
                 <span class="login-input-error-info"></span>
               </span>
            `;
        } else if (!userInfo.isValidSid(sid)) {
            return `
                <span class="login-panel">
                 <h1>Login</h1>
                 <form id="login-form" action="/login" method="POST">
                   <label><span>Username: </span><input id="login-username" name="username"</label>
                   <button class="login-button" type="submit">Login</button>
                   <span class="login-input-error-info"></span>
                 </form>
               </span>
            `;
        } else {
            return `
            <span class="game-panel">
             ${gameAppWeb.getGamePage(sid)}
            </span>
            `;
        }
    },

    getGamePage: function (sid) {
        const {username} = userInfo.getUsernameBySid(sid);
        const gameRecord = userInfo.getGameStatus({username});
        return `
                <div class="username">
                    <form action="/logout" method="POST">
                        <label>You are ${username} </label><button class="logout-button" type="submit">Logout</button>
                    </form>
                </div>
                <div class="word-list-panel">
                    <h2>Choose A Word From Below:</h2>
                    <div id="valid-guess-words">` + Object.keys(gameRecord.validGuesses).map(word => `
                        <span class="valid-guess">${word}</span>
                        `).join(`  `) +
            `</div> 
                    <h2>Your Guess History:</h2>
                    <div id="guessed-words">` + Object.keys(gameRecord.guessedWords).map(word => `
                        <span class="valid-guess">${word}</span>
                        `).join(``) +
            `</div> 
                    <h2 class="previous-guess">Last Attempt: ${gameRecord.previousGuess}</h2>
                
                         <h2 class="guess-result-handle">Your Guess Result: </h2>
                        <div class="guess-result">
                            <span id="result" data-guess-result="${gameRecord.gameResult}">${gameRecord.gameResult}</span>
                        </div>
                    
                        <form action="/new-game" method="POST">
                            <button class="start-a-new-game-button" type="submit">Start a New Game</button>
                        </form>
                    </div>
                    <div class="guess-word-submit-panel">
                        <form id="guess-form" action="/guess" method="POST">
                            <input id="to-guess-word" name="word" placeholder="Guess a word"/>
                            <button class="change-word-button" type="submit">Submit</button>
                        </form>
                        <p class="input-info"></p>
                    </div>
        `;
    },
}

module.exports = gameAppWeb;