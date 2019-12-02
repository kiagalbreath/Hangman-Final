window.onload = function() {
  max_attempts = 10;
  alphabet = 'abcdefghijklmnopqrstuvwxyz';
  word = null;
  wordList = [
    'merry christmas',
    'down to the wire',
    'keep on truckin',
    'easy as pie',
    'in a pickle',
    'beating around the bush',
    'needle in a haystack',
    'son of a gun',
    'a dime a dozen',
    'jack of all trades',
    'cup of joe',
    'on cloud nine',
    'starstruck'
  ];
  wordSpaces = 0;
  guessedLetters = null;
  correctGuesses = 0;
  badGuesses = 0;
  endResult = null;

  init = () => {
    this.endResult = null;
    this.playGame();
    this.newGame();
  }

  showEndResult = (result) => {
    if(result === 'game over') {
      this.endResult = 'game over';
      this.document.getElementsByClassName('endResult-btn')[0].innerHTML = 'play new game';
    } else {
      this.endResult = 'continue';
      this.document.getElementsByClassName('endResult-btn')[0].innerHTML = 'continue';
    }
    this.document.getElementsByClassName('endResult-btn')[0].className = 'endResult-btn show';
  }

  hideEndResultBtn = () => {
    this.document.getElementsByClassName('endResult-btn')[0].className = 'endResult-btn hide';
  }

  hideDefaultMessages = () => {
    document.getElementsByClassName('instructions')[0].className = 'instructions hide';
    document.getElementsByClassName('attempts')[0].className = 'attempts hide';
  }

  hideAllMessages = () => {
    document.getElementsByClassName('instructions')[0].className = 'instructions hide';
    document.getElementsByClassName('attempts')[0].className = 'attempts hide';
    document.getElementsByClassName('gameOver')[0].className = 'gameOver hide';
    document.getElementsByClassName('youWin')[0].className = 'youWin hide';
  }


  playGame = () => {
    // listener callback function - remove listener for "play game" button and hide the intro screen
    let playGameClick = function(e) {
      e.preventDefault();
      playGameBtn.removeEventListener('click', playGameClick, false);
      document.getElementsByClassName('intro-btn')[0].className = 'intro-btn hide';
      document.getElementsByClassName('intro-bg')[0].className = 'intro-bg hide';
    }
    // add listener to the "play game" button
    let playGameBtn = document.getElementsByClassName('intro-btn')[0];
    playGameBtn.addEventListener('click', playGameClick, false);
  }

  gameOver = () => {
    this.hideDefaultMessages();
    document.getElementsByClassName('gameOver')[0].className = 'gameOver show';
    this.document.getElementsByClassName('endResult-btn')[0].className = 'endResult-btn show';

    // show the entire word or phrase
    for (let key in this.word) {
      let letters = document.getElementById('word').getElementsByTagName('li');
      let elem = letters[key];  
      elem.innerHTML = this.word[key];
    }
    this.showEndResult('game over');
  }

  continuePlaying = () => {
    this.hideDefaultMessages();
    document.getElementsByClassName('youWin')[0].className = 'youWin show';
    this.showEndResult('continue');
  }

 resetGame = () => {
    // if the player lost show them the intro screen
    if(this.endResult === 'game over') {
      document.getElementsByClassName('intro-btn')[0].className = 'intro-btn';
      document.getElementsByClassName('intro-bg')[0].className = 'intro-bg';
    }

    this.word = null;
    this.wordSpaces = 0;
    this.guessedLetters = null;
    this.correctGuesses = 0;
    this.badGuesses = 0;
    document.getElementById('word').innerHTML = '';
    document.getElementById('letters').innerHTML = '';
    document.getElementsByClassName('dead-guy')[0].className = 'dead-guy';
    this.hideAllMessages();
    this.init();
  }

  newGame = () => {
    this.badGuesses = 0;
    this.correctGuesses = 0;
    this.guessedLetter = '';
    this.word = this.getNewWord();
    this.createControls();
    this.createLetterHolders();

    // show the default messages, hide "GAME OVER" and "YOU WIN!" messages and hide the "end result button"
    this.hideAllMessages();
    this.hideEndResultBtn();
    document.getElementsByClassName('instructions')[0].className = 'instructions show';
    document.getElementsByClassName('attempts')[0].className = 'attempts show';

    console.log('word: '+this.word);
  }

  getNewWord = () => {
    var word = this.wordList[ Math.floor( Math.random() * this.wordList.length ) ];
    return word;
  }

  createControls = () => {
    for(char in this.alphabet) {
      let letter = document.createElement('li');
      var textnode = document.createTextNode(alphabet[char]);
      letter.appendChild(textnode);
      document.getElementById('letters').appendChild(letter);
    }
    document.getElementById('attempts_remaining').innerHTML = (this.max_attempts-this.badGuesses);
  }

  createLetterHolders = () => {
    for(char of this.word) {
      let letterHolder = document.createElement('li');

      if(char === ' ') {
        letterHolder.className = 'empty';
        this.wordSpaces++;
      }
      document.getElementById('word').appendChild(letterHolder);
    }
    this.captureLetterClicks();
  }

  captureLetterClicks = () => {
    let letters = document.getElementById('letters').getElementsByTagName('li');

    for(let i = 0; i < letters.length; i++) {
      let elem = letters[i];

      elem.onclick = function() {
        guessLetter(elem.innerHTML);
        return false;
      };
    }
  }
  
  getHits = function(query, array){
    count = 0;
    hit = 0;
    
    while( array.indexOf( query, hit ) > -1 ) {
      hit = array.indexOf( query, hit )+1;
      count++;
    }
    return count;
  }

  letterCheck = (letter) => {
    let wordPosition;
    let hit = false;

    // show the correctly guesses letter(s)
    for( char in this.word ) {
      if( this.guessedLetter.indexOf( this.word[char] ) > -1 ) {
        wordPosition = char;
        let letters = document.getElementById('word').getElementsByTagName('li');
        let elem = letters[wordPosition];   
        elem.innerHTML = letter;
        hit = true;
      }
    }

    // disable the guessed letter(s) from the controls
    let controlsLetter = document.getElementById('letters').getElementsByTagName('li');
    for( char in alphabet ) {
      let elem2 = controlsLetter[char];

      if(hit === true && elem2.innerHTML === letter) {
        elem2.className = 'guessed';
      } else if(hit === false && elem2.innerHTML === letter) {
        elem2.className = 'bad-guess';
        this.setDeadGuyMask();
      }
    }
  }  

  guessLetter = (letter) => {
    if( this.guessedLetter.indexOf(letter) < 0 ) {
      this.guessedLetter = letter;
      let hits = this.getHits(letter, this.word);
      
      if ( hits <= 0 ) {
        this.badGuesses++;
      } else {
        this.correctGuesses += hits;
      }
    }

    this.letterCheck(letter);
    document.getElementById('attempts_remaining').innerHTML = (this.max_attempts-this.badGuesses);
  
    if( this.word.length-this.wordSpaces === this.correctGuesses ) {
      this.continuePlaying();
      
    } else if( this.badGuesses >= this.max_attempts ) {
      this.gameOver();
    }
  }

  // initialize the game
  this.init();
}