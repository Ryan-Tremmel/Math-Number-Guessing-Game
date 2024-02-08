'use strict';
import { closeModal, showModal } from './modal.js';

class App {
  //////////////////////////////////////
  // Variables /////////////////////////

  // Buttons and Elements
  btnAgain = document.querySelector('.btn--again');
  btnRules = document.querySelector('.btn--rules');
  btnCheck = document.querySelector('.btn--check');
  body = document.querySelector('body');
  main = document.querySelector('main');
  titleEl = document.querySelector('.header__title');
  numberEl = document.querySelector('.header__number-question');
  highscoreEl = document.querySelector('.section__score-highscore');
  livesEl = document.querySelector('.section__score-lives');
  messageEl = document.querySelector('.section__score-message');
  operatorsEl = document.querySelector('.section__operators');

  // Operators
  add = document.querySelectorAll('.add');
  sub = document.querySelectorAll('.sub');
  mult = document.querySelectorAll('.mult');
  div = document.querySelectorAll('.div');

  // Inputs
  guessLeft = document.querySelector('.section__guess--left');
  guessRight = document.querySelector('.section__guess--right');

  //////////////////////////////
  // States ////////////////////

  __highscore = 12;
  __lives = 12;
  inputs = [];
  guess = null;
  number = null;
  operation = null;
  selectedOperatorBtn = null;

  // Functions in constructor are called at application start
  constructor() {
    ///////////////////////////////////////
    // Event Listeners ////////////////////
    this.__setupEventListeners();

    ////////////////////////////////////////
    // Functions ///////////////////////////

    this.__generateRandomNumber(1, 200);
  }

  ///////////////////////////////////////
  // Event Listeners ////////////////////

  __setupEventListeners() {
    document.querySelector('.modal__btn').addEventListener('click', closeModal); // Event listener for modal window and button inside modal
    this.btnRules.addEventListener('click', showModal); // Event listener for rules modal to bring up modal window
    this.btnAgain.addEventListener('click', this.__resetGame.bind(this)); // Event listenter for Play Again! button
    this.operatorsEl.addEventListener(
      'click',
      this.__selectOperation.bind(this)
    ); // Event listener for operators section
    this.btnCheck.addEventListener('click', this.__checkInputs.bind(this)); // Event listener for Check! button
  }

  //////////////////////////////////
  // Utility //////////////////////

  __clearInputs() {
    this.guessLeft.value = '';
    this.guessRight.value = '';
    this.inputs = [];
    this.operation = null;
  }

  __updateUI(type) {
    switch (type) {
      case 'win':
        this.titleEl.textContent = 'YOU WON!';
        this.numberEl.textContent = this.number;
        this.highscoreEl.textContent = ` ${this.__highscore} Tries!`;
        this.messageEl.textContent = 'Correct!';

        if (this.number >= 100)
          document.querySelector('.header__number').style.padding = '4rem 9rem';
        break;
      case 'lose':
        this.titleEl.textContent = 'YOU LOST!';
        this.numberEl.textContent = this.number;
        this.messageEl.textContent = `Your guess was "${this.guess}"`;
        break;
      case 'reset':
        this.titleEl.textContent = 'Guess the Number!';
        this.numberEl.textContent = '?';
        this.livesEl.textContent = 12;
        this.messageEl.textContent = 'Start guessing...';
        document.querySelector('.header__number').style.padding = '4rem 0';
        break;
    }
  }

  __updateHighscore() {
    // If the current highscore is > new highscore, updates highscore
    let newHighscore = 12 - this.__lives + 1;
    this.__highscore =
      newHighscore < this.__highscore ? newHighscore : this.__highscore;
  }

  __resetGame() {
    // Sets all variables and states back to initialized state
    this.__lives = 12;
    this.guess = null;
    this.selectedOperatorBtn = null;

    // Enables all operator buttons
    document
      .querySelectorAll('.section__operators-btn')
      .forEach(btn =>
        btn.classList.remove('section__operators-btn--disabled', 'disabled')
      );

    // Sets body to original color and enables <main />
    this.body.style.backgroundColor = '#222';
    this.main.classList.remove('disabled');

    // Updates UI to original text content
    this.__updateUI('reset');

    // Generates new random number
    this.__generateRandomNumber(1, 200);
  }

  __removeLife() {
    this.__lives--;
    this.livesEl.textContent = this.__lives;
  }

  ///////////////////////////////////////
  // Functionality //////////////////////

  __generateRandomNumber(min, max) {
    this.number = Math.floor(Math.random() * (max - min) + 1) + min;
  }

  __selectOperation(e) {
    // Checks if the element the user clicked on is the button or div containing the button, and if div, returns so that no classes are added
    if (e.target.matches('div')) return;

    // Removes active class from all operator buttons
    document
      .querySelectorAll('.section__operators-btn')
      .forEach(btn => btn.classList.remove('section__operators-btn--active'));

    // Selects appropriate button pressed
    e.target.classList.add('section__operators-btn--active');

    // Sets the selected operator button to the selected button state variable
    this.selectedOperatorBtn = e.target;

    // Selects the operation based on event target class
    switch (true) {
      case e.target.classList.contains('add'):
        this.operation = 'add';
        break;
      case e.target.classList.contains('sub'):
        this.operation = 'sub';
        break;
      case e.target.classList.contains('mult'):
        this.operation = 'mult';
        break;
      case e.target.classList.contains('div'):
        this.operation = 'div';
        break;
    }
  }

  __checkInputs() {
    // 1) ----- Input Validation -----
    // Checks if player has input two numbers
    if (!this.guessLeft.value || !this.guessRight.value) {
      alert('Please guess two numbers!');
      return;
    }

    // Combines the values of both the left and right guess into an array
    this.inputs = [+this.guessLeft.value, +this.guessRight.value];

    // Checks to see if an operation has been selected
    if (!this.operation) {
      alert('Please select an operation!');
      return;
    }

    // 2) ----- Operation Selection and Evaluation -----
    // Either adds, substracts, multiplies, or divides both guesses based on the selected operation
    switch (this.operation) {
      case 'add':
        this.guess = this.inputs[0] + this.inputs[1];
        break;
      case 'sub':
        this.guess =
          this.inputs[0] >= this.inputs[1]
            ? this.inputs[0] - this.inputs[1]
            : this.inputs[1] - this.inputs[0];
        break;
      case 'mult':
        this.guess = this.inputs[0] * this.inputs[1];
        break;
      case 'div':
        this.guess =
          this.inputs[0] >= this.inputs[1]
            ? this.inputs[0] / this.inputs[1]
            : this.inputs[1] / this.inputs[0];
        break;
    }

    // 3) ----- Input and UI Clean-up -----

    // Clears inputs
    this.__clearInputs();

    // DEVELOPMENT USE ONLY //////////////////////////////

    console.log(`Number to Guess: ${this.number}`);
    console.log(`Player Guess: ${this.guess}`);

    //////////////////////////////////////////////////////

    // Sets the operator button used to disabled, adding the appropriate style classes
    this.selectedOperatorBtn.classList.add(
      'section__operators-btn--disabled',
      'disabled'
    );
    this.selectedOperatorBtn.classList.remove('section__operators-btn--active');

    // 4) ----- Number Checking -----

    let difference = Math.abs(this.number - this.guess);

    // If guess is INCORRECT, checks number of lives and if lives < 1, initiates lose game function - otherwise removes a life and displays how close the player was
    if (this.guess !== this.number) {
      if (this.__lives >= 1) {
        this.__removeLife();

        // If player's guess isn't close
        if (this.number > this.guess) {
          this.messageEl.textContent = `Higher ↑ (${this.guess})`;
        } else {
          this.messageEl.textContent = `Lower ↓ (${this.guess})`;
        }

        // If player's guess is 25 off away from the number to guess
        if (difference < 25 && this.number > this.guess) {
          this.messageEl.textContent = `Higher ↑ (${this.guess}) -  You are close by 25!`;
        } else if (difference < 25 && this.number < this.guess) {
          this.messageEl.textContent = `Lower ↓ (${this.guess}) -  You are close by 25!`;
        }

        // If player's guess is 10 off away from the number to guess
        if (difference < 10 && this.number > this.guess) {
          this.messageEl.textContent = `Higher ↑ (${this.guess}) -  You are close by 10!`;
        } else if (difference < 10 && this.number < this.guess) {
          this.messageEl.textContent = `Lower ↓ (${this.guess}) -  You are close by 10!`;
        }
      }

      if (this.__lives < 1) this.__loseGame();
    } else {
      // Else if guess is CORRECT, initiates win game function
      this.__winGame();
    }
  }

  __winGame() {
    // Sets body to green and disabled <main />
    this.body.style.backgroundColor = '#60b347';
    this.main.classList.add('disabled');
    // Updates highscore
    this.__updateHighscore();
    // Updates UI to show the user has won the game by changing the elements' text contents
    this.__updateUI('win');
  }

  __loseGame() {
    // Sets body to red and disabled <main />
    this.body.style.backgroundColor = 'red';
    this.main.classList.add('disabled');
    // Updates UI to show the user has lost the game by changing the elements' text contents
    this.__updateUI('lose');
  }
}

const app = new App();
