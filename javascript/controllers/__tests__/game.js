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
    //deleting after
    delete games[mockId];
  });
  //testing the create game function
    describe("createGame", () => {
      it("Should return identifier when game created", () => {
        const req = {};
        const res = {
            send: jest.fn()
        };

        gameController.createGame(req, res);
//checking the mock Id is returned
        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledWith(mockId);
      });
    });
    //checking get game
    describe("getGame", () => {

      it("should return status 200 when game is found", () => {
        const req = {
          params: {
            //making sure an id is present
            gameId: mockId,
          },
        };
    
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
        gameController.getGame(req, res);
    //fabricating a json response
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
        //making a request with no id
        const req = {
          params: {
            gameId: "",
          },
        };
    
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
        gameController.getGame(req, res);
    //simple status check will test the json return in the next test
        expect(res.status).toHaveBeenCalledWith(404);
    
       });
      });



      
    });
  
    describe("createGuess", () => {



      it("Should return status 404 when the game isn't present", () => {
        //creating an empty id
        const req = {
          params: {
            gameId: "",
          },
          body: {
            letter: "a",
          }
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
        gameController.createGuess(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
      });
      it('should return status 400 if the guess is not exactly 1 letter', () => {
        
        const gameId = mockId;
        games[gameId] = {
          //setting status to in progress
          status: "In Progress", 
          unmaskedWord: "Banana", 
        
        };
      
        const req = {
          params: { gameId },
          //creating an incorrect number of letters
          body: { letter: 'ab' }, 
        };
      
        const res = {

          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
      
        
        gameController.createGuess(req, res);
      
        // checking for adequate response
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          Message: "Guess must be supplied with 1 letter",
        });
      });
    
        
    
        it("should return status 400 if the game has already been won", () => {
          
            const gameId = mockId;
            games[gameId] = {
                status: "Won", 
            };
    
            const req = {
                params: { gameId },
                //making a guess after the game has been won
                body: { letter: 'a' }, 
            };
    
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            
            gameController.createGuess(req, res);
    
          
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                Message: "Cannot make a guess. The game is not in progress.",
            });
        });
    
        it("should return status 400 if the game has already been lost", () => {
          
            const gameId = mockId;
            games[gameId] = {
                status: "Lost", 
                
            };
    
            const req = {
                params: { gameId },
                body: { letter: 'a' }, 
            };
    
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            
            gameController.createGuess(req, res);
    
            
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                Message: "Cannot make a guess. The game is not in progress.",
            });
        });
    
    
  it("should return status 400 if the guess has been made previously (incorrect guesses)", () => {
    const gameId = mockId;
    games[gameId] = {
      status: "In Progress", 
      word: "banana",
      unmaskedWord: "______",  
//checking guess is already there
      incorrectGuesses: ['c', 'd'], 
    };

    const req = {
      params: { gameId },
      body: { letter: 'c' }, 
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    gameController.createGuess(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      Message: "This letter has already been guessed",
    });
  });
  it('should update the masked word for a correct guess and add to incorrect guesses for an incorrect guess', () => {
    //creating a new game
    const gameId = mockId;
    games[gameId] = {
      status: "In Progress", 
      word: "______", 
      unmaskedWord: "banana", 
      incorrectGuesses: [], 
      remainingGuesses: 6 
    };
  //creating several different requests
    const req1 = {
      params: { gameId },
      body: { letter: 'b' }, 
    };
  
    const req2 = {
      params: { gameId },
      body: { letter: 'z' }, 
    };
  
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    
    gameController.createGuess(req1, res);
    //checking the result of the different requests
    
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
    //creating another game to see if the game is running
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
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
      
        gameController.createGuess(req, res);
        expect(res.status).toHaveBeenCalledWith(200)
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

    
  
