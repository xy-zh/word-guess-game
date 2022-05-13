const express = require('express');
const cookieParser = require('cookie-parser');
const uuid4 = require('uuid').v4;
const app = express();
const PORT = 3000;

const appWeb = require('./game-app-web.js');
const userInfo = require('./user-info.js');

app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(express.static('./public'));

app.get('/', (req, res) => {
    const sid = req.cookies.sid;
    res.send(appWeb.loginPage(sid));
});

app.post('/login', (req, res) => {
    const username = req.body.username.trim();

    if (userInfo.isLegalUsername(username)) {
        const sid = uuid4();
        res.cookie('sid', sid);
        // const isLogged = true;

        userInfo.updateUser({sid, username});
        // userInfo.updateLogStatus({sid, isLogged});

        const gameRecordByUsername = userInfo.getGameStatus({username});
        if (!gameRecordByUsername) {
            userInfo.startNewGame({username});
        }

        res.redirect('/');
    } else {
        res.redirect('/error');
    }
});

app.get('/error', (req, res) => {
    res.status(401).send(appWeb.loginPage("bad username"));
});

app.post('/logout', express.urlencoded({extended: false}), (req, res) => {
    const sid = req.cookies.sid;
    // const isLogged = false;
    userInfo.deleteUsername(sid);
    // userInfo.updateLogStatus({sid, isLogged});

    res.clearCookie('sid');

    res.redirect('/');
});

app.post('/guess', express.urlencoded({extended: false}), (req, res) => {
    const sid = req.cookies.sid;

    if (!userInfo.isValidSid(sid)) {
        res.send(appWeb.loginPage("expired session"));
    } else {
        const {word} = req.body;
        const {username} = userInfo.getUsernameBySid(sid);
        userInfo.updateGuess({username, word});
        res.redirect('/');
    }
});

app.post('/new-game', (req, res) => {
    const sid = req.cookies.sid;
    const username = userInfo.getUsernameBySid(sid);
    if (!userInfo.isValidSid(sid)) {
        res.send(appWeb.loginPage("expired session"));
    } else {
        userInfo.startNewGame(username);
        res.redirect('/');
    }
});

app.listen(PORT, () => console.log(`Listening on "http://localhost:${PORT}"`));