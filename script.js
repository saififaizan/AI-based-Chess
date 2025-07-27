const game = document.getElementById('game');
const player = document.getElementById('player');
const coin = document.getElementById('coin');
const obstacle = document.getElementById('obstacle');

let lane = 1;
const lanePositions = [50, 175, 300];

function movePlayer() {
  player.style.left = lanePositions[lane] + 'px';
}

function jump() {
  if (!player.classList.contains('jump')) {
    player.classList.add('jump');
    setTimeout(() => {
      player.classList.remove('jump');
    }, 500);
  }
}

// Keyboard controls
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft' && lane > 0) {
    lane--;
    movePlayer();
  } else if (e.key === 'ArrowRight' && lane < 2) {
    lane++;
    movePlayer();
  } else if (e.key === 'ArrowUp') {
    jump();
  }
});

// Touch swipe support
let startX = 0, startY = 0;
game.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
});
game.addEventListener('touchend', (e) => {
  const touch = e.changedTouches[0];
  const dx = touch.clientX - startX;
  const dy = touch.clientY - startY;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30 && lane < 2) {
      lane++;
      movePlayer();
    } else if (dx < -30 && lane > 0) {
      lane--;
      movePlayer();
    }
  } else if (dy < -30) {
    jump();
  }
});

// Spawning and movement
function resetElement(el) {
  const randomLane = Math.floor(Math.random() * 3);
  el.style.left = lanePositions[randomLane] + 'px';
  el.style.top = '-50px';
}

function fall(el, speed = 3) {
  let top = parseInt(el.style.top || '-50');
  top += speed;
  el.style.top = top + 'px';

  if (top > 600) resetElement(el);

  // Collision
  if (
    Math.abs(parseInt(player.style.left) - parseInt(el.style.left)) < 40 &&
    top > 500 && top < 580
  ) {
    if (el.id === 'coin') {
      resetElement(el);
      score++;
      document.title = `Score: ${score}`;
    } else if (el.id === 'obstacle') {
      alert('Game Over!\\nScore: ' + score);
      location.reload();
    }
  }
}

let score = 0;
resetElement(coin);
resetElement(obstacle);

function gameLoop() {
  fall(coin, 4);
  fall(obstacle, 6);
  requestAnimationFrame(gameLoop);
}

movePlayer();
gameLoop();
