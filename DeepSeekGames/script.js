let score = 0;
let timeLeft = 10;
let timerId;

const clickButton = document.getElementById('clickButton');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');

// Function to update the score
clickButton.addEventListener('click', () => {
  score++;
  scoreDisplay.textContent = score;
});

// Function to start the timer
function startTimer() {
  timerId = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft === 0) {
      clearInterval(timerId);
      clickButton.disabled = true;
      alert(`Time's up! Your score is ${score}.`);
    }
  }, 1000);
}

// Start the game
startTimer();