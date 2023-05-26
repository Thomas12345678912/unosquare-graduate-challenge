const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { json, urlencoded } = require("body-parser");
const gamesController = require("./controllers/game");
const path = require('path');




const app = express();

app.use(cors());
app.use(json());
app.use(morgan("tiny"));
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
    const startGame = `<form action="/games" method="get">
                          <button type="submit">start</button>
                        </form>`;
    res.send(startGame);
  });
  app.post("/games", gamesController.createGame);


app.get("/games/:gameId", gamesController.getGame);


    app.post("/games/:gameId/guesses", gamesController.createGuess)
    
    app.delete("/games/:gameId", gamesController.deleteGame);


      
app.listen(4567, () => {
  console.log("Server listening at http://localhost:4567");
});