document.addEventListener("DOMContentLoaded", function () {
  const emojis = [
    "🐶",
    "🐱",
    "🐭",
    "🐹",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
    "🐨",
    "🐯",
    "🦁",
    "🐮",
  ];
  const cards = [...emojis, ...emojis]; // 24 cards (12 pairs)

  let flippedCards = [];
  let matchedCards = [];
  let timer = 60;
  let timerInterval;
  let player1Matches = 0;
  let player2Matches = 0;
  let numberOfPlayers = 1;
  let currentPlayer = 1;

  const welcomePage = document.getElementById("welcome-page");
  const gamePage = document.getElementById("game-page");
  const winPage = document.getElementById("win-page");
  const losePage = document.getElementById("lose-page");
  const gameBoard = document.getElementById("game-board");
  const timerDisplay = document.getElementById("timer");
  const player1MatchesDisplay = document.getElementById("player1-matches");
  const player2MatchesDisplay = document.getElementById("player2-matches");
  const player2Info = document.getElementById("player2-info");
  const currentPlayerDisplay = document.getElementById("current-player");
  const winTimeDisplay = document.getElementById("win-time");
  const winPlayer1MatchesDisplay = document.getElementById(
    "win-player1-matches"
  );
  const winPlayer2MatchesDisplay = document.getElementById(
    "win-player2-matches"
  );
  const winPlayer2Info = document.getElementById("win-player2-info");
  const loseTimeDisplay = document.getElementById("lose-time");
  const losePlayer1MatchesDisplay = document.getElementById(
    "lose-player1-matches"
  );
  const losePlayer2MatchesDisplay = document.getElementById(
    "lose-player2-matches"
  );
  const losePlayer2Info = document.getElementById("lose-player2-info");
  const flipSound = document.getElementById("flip-sound");
  const matchSound = document.getElementById("match-sound");
  const incorrectSound = document.getElementById("incorrect-sound");

  // Start Game Button
  document.getElementById("start-game").addEventListener("click", function () {
    numberOfPlayers = parseInt(document.getElementById("players").value);
    welcomePage.classList.add("hidden");
    gamePage.classList.remove("hidden");
    if (numberOfPlayers === 2) {
      player2Info.classList.remove("hidden");
    }
    initGame();
    startTimer();
  });

  // Reset Game Button
  document.getElementById("reset-game").addEventListener("click", resetGame);

  // Play Again Buttons
  document
    .getElementById("play-again-win")
    .addEventListener("click", resetGame);
  document
    .getElementById("play-again-lose")
    .addEventListener("click", resetGame);

  // Initialize the game
  function initGame() {
    gameBoard.innerHTML = "";
    flippedCards = [];
    matchedCards = [];
    player1Matches = 0;
    player2Matches = 0;
    player1MatchesDisplay.textContent = player1Matches;
    player2MatchesDisplay.textContent = player2Matches;
    currentPlayer = 1;
    currentPlayerDisplay.textContent = `Player ${currentPlayer}`;
    const shuffledCards = shuffle(cards);
    shuffledCards.forEach((value) => {
      const cardElement = createCard(value);
      gameBoard.appendChild(cardElement);
    });
  }

  // Shuffle the cards
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Create the card elements
  function createCard(value) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.value = value;
    card.textContent = "?";
    card.addEventListener("click", flipCard);
    return card;
  }

  // Flip the card
  function flipCard() {
    if (
      flippedCards.length < 2 &&
      !this.classList.contains("flipped") &&
      !this.classList.contains("matched")
    ) {
      flipSound.play();
      this.classList.add("flipped");
      this.textContent = this.dataset.value;
      flippedCards.push(this);

      if (flippedCards.length === 2) {
        checkForMatch();
      }
    }
  }

  // Check if the flipped cards match
  function checkForMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.value === card2.dataset.value) {
      matchSound.play();
      card1.classList.add("matched");
      card2.classList.add("matched");
      matchedCards.push(card1, card2);
      if (currentPlayer === 1) {
        player1Matches++;
        player1MatchesDisplay.textContent = player1Matches;
      } else {
        player2Matches++;
        player2MatchesDisplay.textContent = player2Matches;
      }

      if (matchedCards.length === cards.length) {
        endGame(true);
      }
    } else {
      incorrectSound.play();
      setTimeout(() => {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        card1.textContent = "?";
        card2.textContent = "?";
      }, 1000);
      if (numberOfPlayers === 2) {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        currentPlayerDisplay.textContent = `Player ${currentPlayer}`;
      }
    }

    flippedCards = [];
  }

  // Start the timer
  function startTimer() {
    timer = 60;
    timerInterval = setInterval(() => {
      timer--;
      timerDisplay.textContent = timer;
      if (timer === 0) {
        endGame(false);
      }
    }, 1000);
  }

  // End the game
  function endGame(isWin) {
    clearInterval(timerInterval);
    gamePage.classList.add("hidden");
    if (isWin) {
      winTimeDisplay.textContent = timer;
      winPlayer1MatchesDisplay.textContent = player1Matches;
      if (numberOfPlayers === 2) {
        winPlayer2MatchesDisplay.textContent = player2Matches;
        winPlayer2Info.classList.remove("hidden");
      }
      winPage.classList.remove("hidden");
    } else {
      loseTimeDisplay.textContent = timer;
      losePlayer1MatchesDisplay.textContent = player1Matches;
      if (numberOfPlayers === 2) {
        losePlayer2MatchesDisplay.textContent = player2Matches;
        losePlayer2Info.classList.remove("hidden");
      }
      losePage.classList.remove("hidden");
    }
  }

  // Reset the game
  function resetGame() {
    clearInterval(timerInterval);
    welcomePage.classList.remove("hidden");
    gamePage.classList.add("hidden");
    winPage.classList.add("hidden");
    losePage.classList.add("hidden");
    player2Info.classList.add("hidden");
    winPlayer2Info.classList.add("hidden");
    losePlayer2Info.classList.add("hidden");
    initGame();
  }
});
