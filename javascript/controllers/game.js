const { v4: uuid } = require("uuid");

const words = ["Banana", "Canine", "Unosquare", "Airport"];
const games = {};

const retrieveWord = () => words[Math.floor(Math.random(words.length - 1))];

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
  
    res.send(gameId)
    
  }
  
  function getGame(req, res) { 
    const gameId = req.params.gameId;   
    if (!gameId) return res.sendStatus(404);
  
    var game = games[gameId];  
    if (!game) {
      return res.sendStatus(404); 
    }
  
    res.status(200).json(clearUnmaskedWord(game));
  }
  

function createGuess(req, res) { 
    const gameId = req.params.gameId;
    let { letter } = req.body;

    if (!gameId) return res.sendStatus(404);

    var game = games[gameId]; 
   
  
    if (!game) return res.sendStatus(404); 
    if (!letter || letter.length != 1) {
        return res.status(400).json({
            Message: "Guess must be supplied with 1 letter"
        })
    }
     
    // todo: add logic for making a guess, modifying the game and updating the status
 
    letter = letter.toUpperCase() && letter; 
    if (game.incorrectGuesses.includes(letter) || game.word.includes(letter)) {
        return res.status(400).json({
            Message: "This letter has already been guessed"
        })
    }

    if (game.unmaskedWord.includes(letter)) {
        for (let loop = 0; loop < game.unmaskedWord.length; loop++) {
            if (game.unmaskedWord[loop] === letter) {
                game.word = game.word.substr(0, loop) + letter + game.word.substr(loop + 1);
            }
        }
    } else {
        game.incorrectGuesses.push(letter);
        game.remainingGuesses--;
    }

    if (game.remainingGuesses === 0) {
        game.status = "Lost";
    } else if (!game.word.includes('_')) {
        game.status = "Won";
    }

    return res.status(200).json(clearUnmaskedWord(game));
}

module.exports = {
    createGame,
    getGame,
    createGuess,
  };