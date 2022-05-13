const sessions = {};
const gameRecordByUsername = [];
const secretWordByUsername = {};

const gameRecord = require('./word-guessing');

function updateUser({sid, username}) {
    sessions[sid] = {username};
}

function getUsernameBySid(sid) {
    return sessions[sid];
}

function deleteUsername(sid) {
    delete sessions[sid];
}

function isValidSid(sid) {
    return sid && sessions[sid];
}

function isLegalUsername(username) {
    const usernameRex = /^[/\da-zA-Z]+$/;
    return username && username !== "dog" && usernameRex.test(username);
}

function startNewGame({username}) {
    if (gameRecordByUsername[username]) {
        delete gameRecordByUsername[username];
    }
    gameRecordByUsername[username] = gameRecord.startNewGame();
    secretWordByUsername[username] = gameRecordByUsername[username].secretWord;
    console.log("Username: " + username);
    console.log("Secret Word is: " + gameRecordByUsername[username].secretWord);
}

function updateGuess({username, word}) {
    const updatedRecord = gameRecordByUsername[username];
    updatedRecord.previousGuess = word.toLowerCase();
    gameRecordByUsername[username] = gameRecord.updateGameRecord(updatedRecord);
}

function getGameStatus({username}) {
    return gameRecordByUsername[username];
}

const userInfo = {
    updateUser,
    getUsernameBySid,
    deleteUsername,
    isValidSid,
    isLegalUsername,
    startNewGame,
    updateGuess,
    getGameStatus,
};

module.exports = userInfo;
