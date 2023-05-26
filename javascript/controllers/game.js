const { v4: uuid } = require("uuid");

const words = ["Banana", "Canine", "Unosquare", "Airport"];
const games = {};

const retrieveWord = () => words[Math.floor(Math.random() * words.length)];

const clearUnmaskedWord = (game) => {
    const withoutUnmasked = { 
        ...game,
    };
    delete withoutUnmasked.unmaskedWord;
    return withoutUnmasked;
}


function createGame(req, res) {
    const newGameWord = retrieveWord();
    const gameId = uuid();
    const newGame = {
      remainingGuesses: 6,
      unmaskedWord: newGameWord,
      word: newGameWord.replaceAll(/[a-zA-Z0-9]/g, "_"),
      status: "In Progress",
      incorrectGuesses: [],
    };
  
    games[gameId] = newGame;
  
   
    res.send(gameId);
    
  }
  
  function getGame(req, res) { 
    const gameId = req.params.gameId;   
    
   //create a first input for the user
   //plan, make fancy ejs page

    if (!gameId) return res.sendStatus(404);
  
    var game = games[gameId];  
    if (!game) {
      return res.sendStatus(404); 
    }


  

    res.status(200).json({
        game: clearUnmaskedWord(game),
     
      });
    } 
  

  function createGuess(req, res) {
    const gameId = req.params.gameId;
    let { letter } = req.body;

    if (!gameId) return res.sendStatus(404);

    var game = games[gameId];
    if (!game) return res.sendStatus(404);
    if (game.status !== "In Progress") {
        return res.status(400).json({
          Message: "Cannot make a guess. The game is not in progress.",
        });
      }
    if (!letter || letter.length !== 1) {
        return res.status(400).json({
            Message: "Guess must be supplied with 1 letter"
        });
    }

    // Convert the letter to lowercase or uppercase
    letter = letter.toLowerCase(); // or letter = letter.toUpperCase();

    // Convert the game word to lowercase or uppercase
    const unmaskedWord = game.unmaskedWord.toLowerCase(); // or game.unmaskedWord.toUpperCase();

    if (game.incorrectGuesses.includes(letter) || game.word.toLowerCase().includes(letter)) {
        return res.status(400).json({
            Message: "This letter has already been guessed"
        });
    }

    if (unmaskedWord.includes(letter)) {
        for (let loop = 0; loop < unmaskedWord.length; loop++) {
            if (unmaskedWord[loop] === letter) {
                game.word = game.word.substr(0, loop) + game.unmaskedWord[loop] + game.word.substr(loop + 1);
            }
        }
    } else {
        game.incorrectGuesses.push(letter);
        game.remainingGuesses--;
    }

    if (game.remainingGuesses === 0) {
        game.status = "Lost";
        game.word = game.unmaskedWord;
    } else if (!game.word.includes('_')) {
        game.status = "Won";
    }

    return res.status(200).json(clearUnmaskedWord(game));
}
function deleteGame(req, res) {
    const gameId = req.params.gameId;
  
    if (!gameId || !games[gameId]) {
      return res.status(404).json({ message: "Game not found" });
    }
  
    const game = games[gameId];
    if (game.status !== "Won" && game.status !== "Lost") {
      return res.status(400).json({ message: "Game is not completed" });
    }
  
    delete games[gameId];
    return res.status(200).json({ message: "Game deleted successfully", gameId });
}


  
  module.exports = {
    createGame,
    getGame,
    createGuess,
    deleteGame,
  };
  
