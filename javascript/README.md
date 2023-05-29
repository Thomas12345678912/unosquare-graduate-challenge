# Javascript Hangman API 

In this partial implementation the technologies used are:

-1. Install Node

To install Node 18 on Windows or macOS, follow these steps:

- Visit the Node website at https://nodejs.org/en/download.

- Make sure the LTS (long-term support) tab is selected 

- Click on the installer that is relevant for your computer. A download should begin with the pkg/msi.

- Follow the installation wizard with the default settings selected.

2. Verify installation

- Open a terminal/command line

- type `node -v`
  - You should see `V18.12.0` or similar appear.
User
# Javascript Hangman API 

In this partial implementation the technologies used are:

- Node version 18
- Node Package Manager (included with node)
- [Express](https://expressjs.com/)
  - Express is a micro web framework that is used to expose API endpoints.
- [Jest](https://jestjs.io/) 
  - Jest is a Javascript testing framework focused on simplicity.

## How to: Run Application

- Please skip Installer sections if you already have the following installed:
  - Node
  - NPM


### Manual Installation macOS & Windows

1. Install Node

To install Node 18 on Windows or macOS, follow these steps:

- Visit the Node website at https://nodejs.org/en/download.

- Make sure the LTS (long-term support) tab is selected 

- Click on the installer that is relevant for your computer. A download should begin with the pkg/msi.

- Follow the installation wizard with the default settings selected.

2. Verify installation

- Open a terminal/command line

- type `node -v`
  - You should see `V18.12.0` or similar appear.


### Package Installation

Installation can also be completed using a package manager.
- Chocolatey: Windows
- Homebrew: macOS
- https://nodejs.org/en/download/package-manager: linux

This approach can be more problematic if a problem occurs and requires more terminal/command line experience. If using WSL with windows we can also use the linux package managers depending on the distribution installed on the WSL.

### Node Version Manager

The last approach for installing node can be completed using Node Version Manager (nvm). This is only available using linux or macOS and can be completed follow the guide [here](https://github.com/nvm-sh/nvm).

Once installed you can simply type:

```
nvm install 18
nvm use 18
```


- [Express](https://expressjs.com/)
  - Express is a micro web framework that is used to expose API endpoints.
- [Jest](https://jestjs.io/) 
  - Jest is a Javascript testing framework focused on simplicity.

## hangman API
Description
This is a web API for a hangman-like word guessing game. The game is composed of a server-side created list of words that the player needs to guess. The player guesses one letter at a time until the word is fully guessed or the player has exhausted their guesses. This project is built using Node.js and Express.js.

## Installation
Prerequisites
Before you begin, ensure you have installed the latest version of:

## Node.js
NPM
Installing
Clone the repository to your local machine using git clone https://github.com/your-repository
Go to the root directory of the project and install the dependencies by running npm install
Usage
To start the application, run node index.js in the root directory of the project. The server will start and listen on http://localhost:4567.

The API exposes several endpoints:

GET /: The landing page with the start game form.
POST /games: Creates a new game and responds with a unique game ID.
GET /games/:gameId: Fetches the current status of a game identified by the gameId path parameter.
POST /games/:gameId/guesses: Takes a guess in the game identified by gameId. The guessed letter should be provided in the request body as { "letter": "a" }.
DELETE /games/:gameId: Deletes a completed game identified by gameId.
Tests
The game.test.js file contains unit tests that cover the game creation, guessing process, game status fetching, and game deletion functionality. You can run these tests with npm run test.

## running the game
- Navigate to the root directory of your Javascript service project in the terminal/command line. For this repository the command would be:
  - `cd javascript`

1. Run the following command to install the services dependencies: `npm install`
2. Run the following command to start up the application: `npm start`
3. (optional) Run the following command to execute the unit tests: `npm test`

The app should now be available at: `http://localhost:4567`



License
