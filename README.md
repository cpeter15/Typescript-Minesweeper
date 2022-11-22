# Browser-Minesweeper

## Project Description

I was planning to make a in-browser version of Minesweeper. Minesweeper is a single player game where the player is tasked with carefully placing a flag on all of the mines without revealing them. the game is made up of a board with unrevealed spaces that could be empty or contain a bomb. If a player clicks on a space containing a bomb, they lose. If a player clicks on an empty space a number is revealed that tells the player how many bombs are in the surrounding spaces. The game is won when the player reveals all the empty spaces and has flagged all of the bombs.

## Game Logic

On page load: ask the player what difficulty they want to play.
create board based on user response
add bombs to board
append board to the DOM
```
while (game != finished){
    wait for the player to click on a space
    if (left click){
        reveal space
        if (space has a bomb){
            player loses game
        }
        else if (space doesn't have a bomb){
            add a number to the space to tell the player how many bombs are in the adjacent spaces
            game continues
        }
    }
    else if (right click){
        flag space
        decrement bomb counter
    }
    if (bomb counter === 0 && all empty spaces are revealed){
        player wins game
    }
}
```

## Deliverables

### MVP Criteria

1. add three difficulties (Beginner, Intermediate, Expert).
2. Creates a board with dimensions based on the difficulties (8x8, 16x16, 30x16).
3. adds a number of mines to the board based on the difficulties (10, 40, 99).
4. clicking on a space should reveal a number of nearby mines or end the game if the space is a mine.
5. right clicking should flag a space as a mine.
6. the player should win the game if they flag all of the mines.
7. add a counter that displays how many bombs are on the board and decrease the counter when the player flags a space
8. there should be a timer that tracks how long it takes for the player to play the game.
9. if the player loses or wins the game, they should get a prompt to play again.

### Post-MVP Plans

1. add a custom difficulty that allows the player to input the dimensions of the board and the amount of mines to add.
2. add themes ex. dark mode.
3. add sound effects
4. add a optional life system
