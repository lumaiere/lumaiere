const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

const ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

let rightPressed = false;
let leftPressed = false;
let touchStartX = null;
let touchEndX = null;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("touchstart", touchStartHandler, false);
document.addEventListener("touchmove", touchMoveHandler, false);
window.addEventListener("deviceorientation", handleOrientation, true);

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function touchStartHandler(e) {
    touchStartX = e.touches[0].clientX;
}

function touchMoveHandler(e) {
    touchEndX = e.touches[0].clientX;
    const diffX = touchEndX - touchStartX;

    if (diffX > 0) {
        // Swipe right
        if (paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        }
    } else if (diffX < 0) {
        // Swipe left
        if (paddleX > 0) {
            paddleX -= 7;
        }
    }

    touchStartX = touchEndX; // Reset touch start for smoother swipes
}

function handleOrientation(event) {
    const tiltLR = event.gamma; // left to right tilt (-90 to 90)

    if (tiltLR > 15 && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (tiltLR < -15 && paddleX > 0) {
        paddleX -= 7;
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            document.location.reload();
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

draw();
