export function saveHighScore(highScore) {
  document.querySelector('.high-score')
    .innerHTML = `HIGH SCORE: ${highScore}`;
  localStorage.setItem('high-score', highScore);
}