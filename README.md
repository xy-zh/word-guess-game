# word guessing game

a web-based word guessing game
  - this site will use a mix of backend-generated HTML and (for extra credit) front-end validation JS


### Home Page

When the User loads the page (path: `/`)
- the site will determine if the user is logged in (based on `sid` session cookie)

- If the user is not logged in:
  - the page will display a login form instead of the below content
  - the login form will ask for a username but will NOT ask for a password
  - the login form will POST to `/login` (see "The Login Flow")

- A logged in user will see:
  - A list of words the secret word could be
  - A list of any previously guessed words and how many letters each matched (see "Making a Guess")
  - A count of how many valid guesses they have made so far (essentially, a score a player wants to keep low)
  - What their most recent guess was, and how many letters it matched
    - or, if their previous guess was invalid they will be told that guess and that it was invalid
      - Hint: The front end can prevent invalid guesses, but the backend should still code for the possibility
  - If their previous guess was correct: a message saying they have won
  - If their previous guess was incorrect: an option to make another guess (see "Making a Guess")
  - An option to logout
  - An option to start a new game
  - Notice: All of the above is true even if they reload the page

### Making a Guess

A guess will be sent as a POST to the path `/guess`
- The server will check for a valid session id
  - If there is not a valid session id, the page will display a message and a login form
    - Hint: an invalid session id could come from manually changing your cookie or restarting the server (it will forget all sessions ids, but the browser will still have the sid cookie)
- The server will check for a valid guess (one of the allowed words for the secret word to be)
  - If the guess is not valid, the server will update the server state for that player and respond with a redirect to the Home Page 
  - If the guess is valid, the server will update the server state for that player and respond with a redirect to the Home Page
  - Hint: See "Home Page" for ideas on what details the server state will have to know.  If we had a database much of that information would be there, but because we do not we will simply hold the state data in different objects.  Remember to keep information for different players separate.

The guess is evaluated for how many letters match between the guess and secret word (see "Starting a New Game"), regardless of position of the letters in the word and regardless of the upper/lower case of the letters.  
- Hint: This should sound like an earlier assignment

### Starting a New Game

A new game begins when a user starts a new game or logs in for the first time.
- A secret word is picked at random from the list of available words

If the user is starting a new game by virtue of logging in for the first time, it is done as part of login and does not require extra navigation in the browser

If the user is manually starting a new game, it is done as a POST to `/new-game`
- The server will check for a valid session id
  - If there is not a valid session id, the page will display a message and a login form
- If there is a valid session, after updating the state, the response will redirect to the Home Page.

Important: No information is sent to the browser that allows someone to learn the secret word without playing the game

### The Login Flow

Login is performed as a POST to `/login`
- It will send only the username, no password
- If the username is valid the server will respond with a `sid` cookie using a uuid.
  - have an allowlist of valid characters
  - explicitly disallow username "dog" (This simulates a user with a bad password, since we aren't using passwords)
  - after setting the cookie header, respond with a redirect to the Home Page
- If the username is invalid, respond with a login form that contains a message about the username being invalid
  - Frontend JS could prevent an invalid username, but the server-side must still handle the possibility

If a username that is in the middle of a game logs in
- They will be able to resume their existing game

### The Logout Flow

A user logs out with a POST to `/logout`
- Even a user with no session id or an invalid session id can logout
- This will clear the session id cookie (if any)  on the browser
- This will remove the session information (if any) from the server
- Logout does NOT clear the game information from the server
  - The user can log in as the same username and resume the game
- After the logout process the server will respond with a redirect to the Home Page
