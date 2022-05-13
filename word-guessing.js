const wordList = require("./words");

function getRandomIndex(maxIndex) {
    return Math.floor(Math.random() * maxIndex);
}

function getSecretWord() {
    const secretWordIndex = getRandomIndex(wordList.length);
    return wordList[secretWordIndex];
}

function startNewGame() {
    let validGuesses = {};
    for (let word of wordList) {
        validGuesses[word] = word[0];
    }
    const currGameRecord = [];
    currGameRecord.guessValidity = false;
    currGameRecord.previousGuess = "";
    currGameRecord.secretWord = getSecretWord();
    currGameRecord.validGuesses = validGuesses;
    currGameRecord.guessedWords = {};
    currGameRecord.gameResult = "";

    return currGameRecord;
}

function updateGameRecord(gameRecord) {
    const guessWord = gameRecord.previousGuess.toLowerCase();
    const secretWord = gameRecord.secretWord.toLowerCase();

    gameRecord.guessValidity = isValidGuess(gameRecord);

    if (gameRecord.guessValidity) {
        gameRecord.gameResult = getGameResult({secretWord, guessWord});
    } else {
        gameRecord.gameResult = "invalid guess";
    }

    updateWordList(gameRecord);
    return gameRecord;
}

function isValidGuess(gameRecord) {
    const guessWord = gameRecord.previousGuess.toLowerCase();
    const validGuessList = gameRecord.validGuesses;
    return !!(guessWord && validGuessList[guessWord]);
}

function updateWordList(gameRecord) {
    const guessWord = gameRecord.previousGuess.toLowerCase();
    if (!isValidGuess(gameRecord)) {
        return;
    }
    gameRecord.guessedWords[guessWord] = guessWord;
    delete gameRecord.validGuesses[guessWord];
}

function getGameResult({secretWord, guessWord}) {
    if (guessWord === secretWord) {
        return "You Win!";
    } else {
        const matchedLetter = compareWords({secretWord, guessWord});
        return "You get " + matchedLetter + " letters matched";
    }
}

function compareWords({secretWord, guessWord}) {
    const letterFreqCount = {};
    let matchedLetterCount = 0;

    for (let letter of secretWord) {
        if (!letterFreqCount[letter]) {
            letterFreqCount[letter] = 1;
        } else {
            letterFreqCount[letter]++;
        }
    }

    for (let letter of guessWord) {
        if (letterFreqCount[letter] && letterFreqCount[letter] > 0) {
            matchedLetterCount++;
            letterFreqCount[letter]--;
        }
    }

    return matchedLetterCount;
}


const gameOutGoing = {
    startNewGame,
    updateGameRecord,
};

module.exports = gameOutGoing;