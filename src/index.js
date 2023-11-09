// Reference DOM elements that are required to build the game
let holes = document.querySelectorAll(".hole");
let moles = document.querySelectorAll(".mole");
const startButton = document.querySelector("#start");
const score = document.querySelector("#score");  // TODO: Add the missing query selectors:
const timerDisplay = document.querySelector("#timer"); // use querySelector() to get the timer element.
const grid = document.querySelector("#grid");
const gameLevel = document.querySelector("#game-level");

// Declare global variables
const totalHoles = 9;
let time = 0;
let timer;
let lastHole = 0;
let points = 0;
let difficulty = "easy";

/**
* This function return single set of hole and mole HTML content
*/
const getGameRenderItem = (idx) => {
  return `<div id="hole${idx}" class="hole">
            <div id="mole${idx}" class="mole"></div>
          </div>`;
};

/**
 *
 * This is the function that starts the game when the `startButton`
 * is clicked.
 *
 */
function startGame() {
  clearScore();

  // NOTE
  // This is required to pass the test case "setEventListeners() in the startGame()"
  // But it is not required to add event every time when a game start.
  // I am calling this method after the page load and this approch required to call only once.
  // check setupGame event handler for more info
  // setEventListeners()

  // Original code
  setDuration(10);
  showUp();

  // new code
  startTimer();

  toggleStartButtonDisable();   // disable start button to avoid multiple click

  return "game started";
}

/**
 * Generates a random integer within a range.
 *
 * The function takes two values as parameters that limits the range
 * of the number to be generated. For example, calling randomInteger(0,10)
 * will return a random integer between 0 and 10. Calling randomInteger(10,200)
 * will return a random integer between 10 and 200.
 *
 */
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Sets the time delay given a difficulty parameter.
 *
 * The function takes a `difficulty` parameter that can have three values: `easy`
 * `normal` or `hard`. If difficulty is "easy" then the function returns a time delay
 * of 1500 milliseconds (or 1.5 seconds). If the difficulty is set to "normal" it should
 * return 1000. If difficulty is set to "hard" it should return a randomInteger between
 * 600 and 1200.
 */
function setDelay(difficulty) {
  // return value in milliseonds based on valid difficulity,
  // otherwise throw error.
  switch (difficulty) {
    case "easy":
      return 1500;
    case "normal":
      return 1000;
    case "hard":
      return randomInteger(600, 1200);
    default:
      throw `Invalid parameter: ${difficulty}`;
  }
}

/**
 * Chooses a random hole from a list of holes.
 *
 * This function should select a random Hole from the list of holes.
 * 1. generate a random integer from 0 to 8 and assign it to an index variable
 * 2. get a random hole with the random index (e.g. const hole = holes[index])
 * 3. if hole === lastHole then call chooseHole(holes) again.
 * 4. if hole is not the same as the lastHole then keep track of 
 * it (lastHole = hole) and return the hole
 *
 */
function chooseHole(holes) {
  let newHoleIndex = lastHole;
  /* 
  find out new hole, this while loop will run untill it 
  found hole that is not equal to last hole.
  */
  while (newHoleIndex == lastHole) {
    newHoleIndex = randomInteger(0, totalHoles - 1);
  }

  // update last hole with new hole so next time we pick new hole.
  lastHole = newHoleIndex;

  // return hole element
  return holes[newHoleIndex];
}

/**
 *
 * Calls the showUp function if time > 0 and stops the game if time = 0.
 *
 * The purpose of this function is simply to determine if the game should
 * continue or stop. The game continues if there is still time `if(time > 0)`.
 * If there is still time then `showUp()` needs to be called again so that
 * it sets a different delay and a different hole. If there is no more time
 * then it should call the `stopGame()` function. The function also needs to
 * return the timeoutId if the game continues or the string "game stopped"
 * if the game is over.
 *
 */
function gameOver() {
  if (time > 0) {
    const timeoutId = showUp();
    return timeoutId;
  } else {
    const gameStopped = stopGame();
    return gameStopped;
  }

}

/**
* Calls the showAndHide() function with a specific delay and a hole.
*
* This function simply calls the `showAndHide` function with a specific
* delay and hole. The function needs to call `setDelay()` and `chooseHole()`
* to call `showAndHide(hole, delay)`.
 */
function showUp() {
  let delay = setDelay(difficulty);  // TODO: Update so that it uses setDelay()
  const hole = chooseHole(holes);  // TODO: Update so that it use chooseHole()
  const timeoutID = showAndHide(hole, delay);
  return timeoutID;
}

/**
* The purpose of this function is to show and hide the mole given
* a delay time and the hole where the mole is hidden. The function calls
* `toggleVisibility` to show or hide the mole. The function should return
* the timeoutID
 */
function showAndHide(hole, delay) {

  // show mole
  toggleVisibility(hole);

  const timeoutID = setTimeout((parm) => {toggleVisibility(parm); // hide mole after given delay

      gameOver();       // show new mole or end game if time is over
    },
    delay,
    hole
  );
  return timeoutID;
}

/**
 * Adds or removes the 'show' class that is defined in styles.css to
 * a given hole. It returns the hole.
 */
function toggleVisibility(hole) {
   // TODO: add hole.classList.toggle so that it adds or removes the 'show' class.
  hole.classList.toggle("show");
  return hole;
}

/**
* This function increments the points global variable and updates the scoreboard.
* Use the `points` global variable that is already defined and increment it by 1.
* After the `points` variable is incremented proceed by updating the scoreboard
* that you defined in the `index.html` file. To update the scoreboard you can use 
* `score.textContent = points;`. Use the comments in the function as a guide 
* for your implementation:
 */
function updateScore() {
  points += 1;   // increment current score by 1
  score.textContent = points;   // display new score
  return points;
}

/**
 *
* This function clears the score by setting `points = 0`. It also updates
* the board using `score.textContent = points`. The function should return
* the points.
*/
function clearScore() {
  points = 0;
  score.textContent = points;
  return points;
}

/**
 * Updates the control board with the timer if time > 0
 */
function updateTimer() {
  if (time > 0) {
    time--; // reduce the time
    timerDisplay.textContent = time;    // display remaining time
  }
  return time;
}

/**
 *
 * Starts the timer using setInterval. For each 1000ms (1 second)
 * the updateTimer function get called. 
 *
 */
function startTimer() {
  timer = setInterval(updateTimer, 1000);
  return timer;
}

/**
* This is the event handler that gets called when a player
* clicks on a mole. The setEventListeners should use this event
* handler (e.g. mole.addEventListener('click', whack)) for each of
* the moles.
 */
function whack(event) {
  points = updateScore();
  return points;
}

/**
* Choose the Game Level and set the value in difficulty level.
*/

let setGameLevel = (event) => {
  console.log(event.target.value)
  difficulty = event.target.value;
}

/**
*
* Adds the 'click' event listeners to the moles. See the instructions
* for an example on how to set event listeners using a for loop.
*/
function setEventListeners() {
  // add event listener for each mole element
  moles.forEach((mole) => { mole.addEventListener("click", whack);});
  return moles;
}

/**
 * This function sets the duration of the game. The time limit, in seconds,
 * that a player has to click on the sprites.
 */
function setDuration(duration) {
  time = duration;
  return time;
}

/**
 * This function is called when the game is stopped. It clears the
 * timer using clearInterval. Returns "game stopped".
 */
function stopGame() {
  // stopAudio(song);  //optional
  clearInterval(timer);
  toggleStartButtonDisable();
  return "game stopped";
}



/**
* This function is used to disable/enable start button.
*/
const toggleStartButtonDisable = () => {
  startButton.classList.toggle("disable");
}


/**
* Render all required set of holes & moles as HTML content
*/
const renderGame = () => {
  let items = [];

  // generate required HTML content
  for (let idx = 0; idx <= totalHoles - 1; idx++) {
    items.push(getGameRenderItem(idx));
  }
  const gameItems = items.join(" ");
  grid.innerHTML = ""; // remove existing content
  grid.innerHTML = gameItems; // display HTML content for game
};

/**
* This function is used to setup the game Setup calling other fuctions.
*/
const setupGame = () => {
  // Add hole & mole content
  renderGame();

  // update global variables and bind event handler(s)
  holes = document.querySelectorAll(".hole");
  moles = document.querySelectorAll(".mole");

  
  startButton.addEventListener("click", startGame);
  gameLevel.addEventListener("change", setGameLevel);

  setEventListeners();
};

// setup setupGame event handler to call after the DOM content is loaded.
document.addEventListener("DOMContentLoaded", setupGame);

// Please do not modify the code below.
// Used for testing purposes.
window.randomInteger = randomInteger;
window.chooseHole = chooseHole;
window.setDelay = setDelay;
window.startGame = startGame;
window.gameOver = gameOver;
window.showUp = showUp;
window.holes = holes;
window.moles = moles;
window.showAndHide = showAndHide;
window.points = points;
window.updateScore = updateScore;
window.clearScore = clearScore;
window.whack = whack;
window.time = time;
window.setDuration = setDuration;
window.toggleVisibility = toggleVisibility;
window.setEventListeners = setEventListeners;