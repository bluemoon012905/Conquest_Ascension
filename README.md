# Conquest Ascension

## Project Status

This project is a turn-based strategy game. The initial setup of the project is complete, including the basic frontend structure using React and a backend structure using Node.js.

So far, the following has been implemented:
- A basic React application with a webpack build system.
- A simple view-switching system to navigate between different parts of the application.
- A main menu with a "Start Game" button.
- A level selection screen with a "Demo" button.
- A placeholder for the main game view.

The project is hosted on GitHub Pages and can be accessed at: [https://bluemoon012905.github.io/Conquest_Ascension/](https://bluemoon012905.github.io/Conquest_Ascension/)

## How to Run the Project

### Running Locally

1.  Install the dependencies:
    ```bash
    npm install
    ```
2.  Start the development server:
    ```bash
    npm start
    ```
    The application will be available at `http://localhost:3000`.

### Building for Production

1.  Build the application:
    ```bash
    npm run build
    ```
    This will create a `docs` folder with the production-ready files.

## Next Steps

The next steps are to implement the core gameplay features as described in the `first_implementation` file.

### Demo Board

-   [x] Create an 8x8 game board component.
-   [x] Implement the ability to drag and drop pieces onto the board.
-   [x] Create a "demo" mode where the user can place pieces for two players (blue and red).

### Pieces and Equipment

-   [x] Define the data structures for pieces (Vanguard, Horseman, Shieldman) and equipment (oct-movement, cross-movement, etc.).
-   [ ] Create a UI for displaying and selecting pieces and equipment.
-   [ ] Implement the logic for equipping items to pieces, including stacking multiple items.
-   [ ] Create the visual representation of pieces (circles) and equipment (rectangles, hexagons, shields).

### Gameplay

-   [ ] Implement the turn-based game loop.
-   [ ] When a piece is clicked, display its movement options (blue tiles) and attack options (red tiles).
-   [ ] Handle overlapping movement and attack options (purple tiles) with a prompt for the user to choose an action.
-   [ ] Implement an "undo" button for individual piece actions.
-   [ ] Implement a "submit moves" button to end the turn.
-   [ ] Implement the combat system, including dice rolls for attack and defense, and updating health.
-   [ ] Display health bars above the pieces.
-   [ ] Remove pieces from the board when their health reaches zero.
-   [ ] Implement the win/loss conditions.
-   [ ] Add a button to return to the main menu or the demo board setup after a game ends.