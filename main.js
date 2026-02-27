const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverScreen = document.getElementById('gameOverScreen');
const startScreen = document.getElementById('startScreen');
const finalScoreElement = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');

// Game Constants
const GRAVITY = 0.5;
const FLAP_STRENGTH = -8;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const PIPE_SPEED = 3;
const PIPE_SPAWN_RATE = 100; // Frames

// Game Variables
let bird;
let pipes = [];
let frames = 0;
let score = 0;
let gameState = 'START'; // START, PLAYING, GAME_OVER

// Bird Class
class Bird {
    constructor() {
        this.x = 50;
        this.y = canvas.height / 2;
        this.radius = 15;
        this.velocity = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#f1c40f'; // Yellow bird
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        // Eye
        ctx.beginPath();
        ctx.arc(this.x + 5, this.y - 5, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();

        // Pupil
        ctx.beginPath();
        ctx.arc(this.x + 6, this.y - 5, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.velocity += GRAVITY;
        this.y += this.velocity;
    }

    flap() {
        this.velocity = FLAP_STRENGTH;
    }
}

// Pipe Class
class Pipe {
    constructor() {
        this.x = canvas.width;
        // Random top pipe height
        this.topHeight = Math.random() * (canvas.height - PIPE_GAP - 100) + 50;
        this.bottomY = this.topHeight + PIPE_GAP;
        this.passed = false;
    }

    draw() {
        ctx.fillStyle = '#2ecc71'; // Green pipes
        ctx.strokeStyle = '#27ae60';
        ctx.lineWidth = 4;

        // Top pipe
        ctx.fillRect(this.x, 0, PIPE_WIDTH, this.topHeight);
        ctx.strokeRect(this.x, 0, PIPE_WIDTH, this.topHeight);

        // Pipe cap (top)
        ctx.fillRect(this.x - 5, this.topHeight - 20, PIPE_WIDTH + 10, 20);
        ctx.strokeRect(this.x - 5, this.topHeight - 20, PIPE_WIDTH + 10, 20);

        // Bottom pipe
        const bottomHeight = canvas.height - this.bottomY;
        ctx.fillRect(this.x, this.bottomY, PIPE_WIDTH, bottomHeight);
        ctx.strokeRect(this.x, this.bottomY, PIPE_WIDTH, bottomHeight);

        // Pipe cap (bottom)
        ctx.fillRect(this.x - 5, this.bottomY, PIPE_WIDTH + 10, 20);
        ctx.strokeRect(this.x - 5, this.bottomY, PIPE_WIDTH + 10, 20);
    }

    update() {
        this.x -= PIPE_SPEED;
    }
}

function init() {
    bird = new Bird();
    pipes = [];
    frames = 0;
    score = 0;
    gameState = 'PLAYING';
    gameOverScreen.classList.add('hidden');
    startScreen.classList.add('hidden');
    loop();
}

function drawBackground() {
    // Sky is handled by CSS, we can draw ground or clouds here if needed
    // Simple ground
    ctx.fillStyle = '#ded895';
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
    ctx.strokeStyle = '#c5bb6f';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 20);
    ctx.lineTo(canvas.width, canvas.height - 20);
    ctx.stroke();
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(score, canvas.width / 2, 50);
    ctx.strokeText(score, canvas.width / 2, 50);
}

function checkCollision(pipe) {
    // Check pipe collision
    if (bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + PIPE_WIDTH) {
        if (bird.y - bird.radius < pipe.topHeight || bird.y + bird.radius > pipe.bottomY) {
            return true;
        }
    }
    // Check floor collision
    if (bird.y + bird.radius >= canvas.height - 20) {
        return true;
    }
    // Check ceiling (optional, currently it just bounces or falls)
    if (bird.y - bird.radius <= 0) {
        bird.y = bird.radius;
        bird.velocity = 0;
    }
    return false;
}

function gameOver() {
    gameState = 'GAME_OVER';
    finalScoreElement.innerText = score;
    gameOverScreen.classList.remove('hidden');
}

function loop() {
    if (gameState !== 'PLAYING') return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    drawBackground();

    // Update and draw bird
    bird.update();
    bird.draw();

    // Manage pipes
    if (frames % PIPE_SPAWN_RATE === 0) {
        pipes.push(new Pipe());
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        let p = pipes[i];
        p.update();
        p.draw();

        // Check collision
        if (checkCollision(p)) {
            gameOver();
            return; // Stop current loop
        }

        // Update score
        if (p.x + PIPE_WIDTH < bird.x - bird.radius && !p.passed) {
            score++;
            p.passed = true;
        }

        // Remove off-screen pipes
        if (p.x + PIPE_WIDTH < 0) {
            pipes.splice(i, 1);
        }
    }

    drawScore();

    frames++;
    requestAnimationFrame(loop);
}

// Controls
function handleInput() {
    if (gameState === 'START') {
        init();
        bird.flap();
    } else if (gameState === 'PLAYING') {
        bird.flap();
    }
}

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault(); // Prevent scrolling
        handleInput();
    }
});

window.addEventListener('mousedown', () => {
    handleInput();
});

window.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleInput();
}, { passive: false });

restartButton.addEventListener('click', init);

// Initial draw (for start screen)
ctx.clearRect(0, 0, canvas.width, canvas.height);
drawBackground();
let startBird = new Bird();
startBird.draw();
