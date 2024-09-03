// The canvas context for drawing
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player object
const player = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    width: 20,
    height: 20,
    speed: 5,
    dx: 0
};

// Alien object
const alien = {
    x: Math.random() * (canvas.width - 30),
    y: 0,
    width: 30,
    height: 30,
    speed: 2
};

// Bullet object
const bullet = {
    x: 0,
    y: 0,
    width: 5,
    height: 10,
    speed: 7,
    fired: false
};

// Draw functions
function drawPlayer() {
    ctx.fillStyle = '#0F0';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawAlien() {
    ctx.fillStyle = 'red';
    ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
}

function drawBullet() {
    if (bullet.fired) {
        ctx.fillStyle = '#FF0';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
}

// Move player
function movePlayer() {
    player.x += player.dx;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

// Move bullet
function moveBullet() {
    if (bullet.fired) {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) bullet.fired = false;
    }
}

// Move alien
function moveAlien() {
    alien.y += alien.speed;
    if (alien.y > canvas.height) {
        alien.x = Math.random() * (canvas.width - alien.width);
        alien.y = 0;
    }
}

// Collision detection
function checkCollision() {
    if (bullet.fired && 
        bullet.x < alien.x + alien.width &&
        bullet.x + bullet.width > alien.x &&
        bullet.y < alien.y + alien.height &&
        bullet.y + bullet.height > alien.y) {
        alien.x = Math.random() * (canvas.width - alien.width);
        alien.y = 0;
        bullet.fired = false;
    }
}

// Update game state
function update() {
    movePlayer();
    moveBullet();
    moveAlien();
    checkCollision();
}

// Render function
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawAlien();
    drawBullet();
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Event listeners for player movement
document.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowLeft') player.dx = -player.speed;
    if(e.key === 'ArrowRight') player.dx = player.speed;
    if(e.key === ' ') {
        if (!bullet.fired) {
            bullet.x = player.x + player.width / 2 - bullet.width / 2;
            bullet.y = player.y;
            bullet.fired = true;
        }
    }
});

document.addEventListener('keyup', (e) => {
    if(e.key === 'ArrowLeft' || e.key === 'ArrowRight') player.dx = 0;
});

// Start the game
gameLoop();