const gameController = require("../game");
const { games } = gameController;

const mockId = 'fda56100-0ddb-4f06-9ea4-7c1919ff6d2f';
jest.mock("uuid", () => ({ v4: () => mockId }));

describe("gameController", () => {
  beforeEach(() => {
    // Setup a new game before each test
    games[mockId] = {
      remainingGuesses: 6,
      word: "______",
      unmaskedWord: "banana",
      status: "In Progress",
      incorrectGuesses: [],
    };
});

  afterEach(() => {
    delete games[mockId];
  });
    describe("createGame", () => {
      it("Should return identifier when game created", () => {
        const req = {};
        const res = {
            send: jest.fn()
        };

        gameController.createGame(req, res);

        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledWith(mockId);
      });
    });
    describe("getGame", () => {
      it("should return status 200 when game is found", () => {
        const req = {
          params: {
            gameId: mockId,
          },
        };
    
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
        gameController.getGame(req, res);
    
        expect(res.json).toHaveBeenCalledWith({
          game: {
            remainingGuesses: 6,
            word: "______",
            status: "In Progress",
            incorrectGuesses: [],
          },
        });
      });
      it("should return status 404 when the game is not found", () => {
        const req = {
          params: {
            gameId: "",
          },
        };
    
        const res = {
          sendStatus: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
        gameController.getGame(req, res);
    
        expect(res.sendStatus).toHaveBeenCalledWith(404);
    
       });
      });



      
    });
  
    describe("createGuess", () => {



      it("Should return status 404 when the game isn't present", () => {
        const req = {
          params: {
            gameId: "",
          },
          body: {
            letter: "a",
          }
        };
        const res = {
          sendStatus: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
        gameController.createGuess(req, res);
        expect(res.sendStatus).toHaveBeenCalledWith(404);
      });
      it('should return status 400 if the guess is not exactly 1 letter', () => {
        // Prepare
        const gameId = "fda56100-0ddb-4f06-9ea4-7c1919ff6d2f";
        games[gameId] = {
          status: "In Progress", // Game is ongoing
          unmaskedWord: "Banana", // Example unmasked word
          // ...Other necessary properties
        };
      
        const req = {
          params: { gameId },
          body: { letter: 'ab' }, // Incorrect guess length
        };
      
        const res = {
          sendStatus: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
      
        // Act
        gameController.createGuess(req, res);
      
        // Assert
        expect(res.sendStatus).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          Message: "Guess must be supplied with 1 letter",
        });
      });
      
      describe("createGuess", () => {
        // ...other tests...
    
        it("should return status 400 if the game has already been won", () => {
            // Arrange
            const gameId = mockId;
            games[gameId] = {
                status: "Won", // Game has been won
                // ...other necessary properties
            };
    
            const req = {
                params: { gameId },
                body: { letter: 'a' }, // Any guess
            };
    
            const res = {
                sendStatus: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            // Act
            gameController.createGuess(req, res);
    
            // Assert
            expect(res.sendStatus).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                Message: "Cannot make a guess. The game is not in progress.",
            });
        });
    
        it("should return status 400 if the game has already been lost", () => {
            // Arrange
            const gameId = mockId;
            games[gameId] = {
                status: "Lost", 
                
            };
    
            const req = {
                params: { gameId },
                body: { letter: 'a' }, 
            };
    
            const res = {
                sendStatus: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            
            gameController.createGuess(req, res);
    
            
            expect(res.sendStatus).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                Message: "Cannot make a guess. The game is not in progress.",
            });
        });
    });
    
  it("should return status 400 if the guess has been made previously (incorrect guesses)", () => {
    const gameId = mockId;
    games[gameId] = {
      status: "In Progress", 
      word: "banana",
      unmaskedWord: "______",  

      incorrectGuesses: ['c', 'd'], 
    };

    const req = {
      params: { gameId },
      body: { letter: 'c' }, 
    };

    const res = {
      sendStatus: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    gameController.createGuess(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      Message: "This letter has already been guessed",
    });
  });
  it('should update the masked word for a correct guess and add to incorrect guesses for an incorrect guess', () => {
    // Prepare
    const gameId = "fda56100-0ddb-4f06-9ea4-7c1919ff6d2f";
    games[gameId] = {
      status: "In Progress", // Game is ongoing
      word: "______", // Masked word
      unmaskedWord: "banana", // Example unmasked word
      incorrectGuesses: [], // Initial incorrect guesses
      remainingGuesses: 6 // Initial remaining guesses
    };
  
    const req1 = {
      params: { gameId },
      body: { letter: 'b' }, 
    };
  
    const req2 = {
      params: { gameId },
      body: { letter: 'z' }, 
    };
  
    const res = {
      sendStatus: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    
    gameController.createGuess(req1, res);
    
    
    expect(games[gameId].word).toEqual("b_____"); 
    expect(games[gameId].incorrectGuesses.length).toEqual(0); 
    expect(games[gameId].remainingGuesses).toEqual(6); 
  
    
    gameController.createGuess(req2, res);
    
  
    expect(games[gameId].word).toEqual("b_____"); 
    expect(games[gameId].incorrectGuesses.length).toEqual(1); 
    expect(games[gameId].incorrectGuesses[0]).toEqual('z'); 
    expect(games[gameId].remainingGuesses).toEqual(5); 
  });
  
      it("Should return 200 when game is running",()=>{
        
        games[mockId] = {
          remainingGuesses: 6,
          word: "banana",
          unmaskedWord: "banana",
          status: "In Progress",
          incorrectGuesses: [],
        };
      
        const req ={
          params: {
            gameId : mockId,
            status: "In Progress"
          },
        body:{
          letter : "z"
        }}
        const res={
          sendStatus: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
      
        gameController.createGuess(req, res);
        expect(res.sendStatus).toHaveBeenCalledWith(200)
      });
    describe("deleteGame function", () => {
  
          it("should delete game if it exists and is completed", () => {
         
            const gameId = mockId;
            const req = {
              params: {
                gameId: gameId,
              },
            };
            const res = {
              status: jest.fn().mockReturnThis(),
              json: jest.fn(),
              sendStatus: jest.fn(),
            };
            games[gameId] = {
              status: "Won", 
            };
        
       
            gameController.deleteGame(req, res);
        
          
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Game deleted successfully", gameId });
        
            
            expect(games[gameId]).toBeUndefined();
          });
        });
        
  }); 

    
  
