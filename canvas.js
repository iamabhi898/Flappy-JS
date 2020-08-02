const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");

const cvHeigth = canvas.height;
const cvWidth = canvas.width;

// score board 
let isGamestart = false;
let score = document.querySelector(".score");
let highscore = document.querySelector(".highscore span");
let scoreCount = 0;

function Ball() {

    this.x = cvWidth * 0.5;
    this.y = cvHeigth * 0.5;
    this.yVel = 0;
    this.yAcc = 1;
    this.radius = 15;

    this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = isGamestart ? "green" : "blue";
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    this.update = function () {
        this.y += this.yVel;
        this.yVel += this.yAcc;
    }

    this.hop = function (event) {
        if (event.key === " " || event.type === "mousedown") {
            this.yVel += -13;
        }
    }

    this.collideBoundary = function () {
        if (this.y < 0 || this.y > cvHeigth) {
            return true;
        }
        return false;
    }

    this.collideWall = function (wall) {
        // collision to lower part of wall
        if ((this.x + this.radius * 0.9) > wall.x && (this.x - this.radius * 0.9) < (wall.x + wall.width) && (this.y + this.radius * 0.9) > wall.y) {
            return true;
        }
        // collision to upper part of wall
        else if ((this.x + this.radius * 0.9) > wall.x && (this.x - this.radius * 0.9) < (wall.x + wall.width) && (this.y - this.radius * 0.9) < (wall.y - wall.gap)) {
            return true;
        }
        return false;
    }

    this.resetPosition = function () {
        isGamestart = false;
        this.yVel = 0;
        this.y = cvHeigth * 0.5;
    }

    this.crosses = function (wall) {
        if ((this.x - this.radius) >= (wall.x + wall.width) && (this.x - this.radius) < (wall.x + wall.width - wall.xVel)) {
            return true;
        }
        return false;
    }

}

function Wall(xPos) {

    // gap/hole height in the wall
    this.gapPercentByHeight = 22;
    this.gap = cvHeigth * this.gapPercentByHeight * 0.01;

    this.getRandomHeight = function () {
        // assuming the height of screen is 100
        const max = 85;
        const min = 15 + this.gapPercentByHeight;

        return cvHeigth * Math.floor(Math.random() * (max - min + 1) + min) * 0.01;
    }

    // width of wall 
    this.width = cvWidth * 0.14;
    // positions and x-velocity of wall
    this.x = cvWidth * xPos;
    this.y = this.getRandomHeight();
    this.xVel = -2;


    this.draw = function () {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, cvHeigth - this.y);
        ctx.strokeRect(this.x, 0, this.width, this.y - this.gap)
    }

    this.update = function () {
        // moving wall
        this.x += this.xVel;
        // repositioning wall when passed through screen
        if (this.x < -this.width) {
            this.x = cvWidth;
            this.y = this.getRandomHeight();
        }
    }

    this.resetPosition = function () {
        // repositioning wall when gameover
        this.x = cvWidth * xPos;
        this.y = this.getRandomHeight();
    }
}

let ball;
let wall_1;
let wall_2;

(function setup() {
    ball = new Ball();
    // 1.2 and 1. is relative to canvas width i.e. 1.2 * cvWidth
    wall_1 = new Wall(1.2);
    wall_2 = new Wall(1.8);

    window.setInterval(function () {
        ctx.clearRect(0, 0, cvWidth, cvHeigth);

        if (isGamestart) {
            ball.update();
            wall_1.update();
            wall_2.update();
        }

        if (ball.collideBoundary()) {
            ball.resetPosition();
            wall_1.resetPosition();
            wall_2.resetPosition();
        }

        if (ball.collideWall(wall_1) || ball.collideWall(wall_2)) {
            ball.resetPosition();
            wall_1.resetPosition();
            wall_2.resetPosition();
        }

        if (ball.crosses(wall_1) || ball.crosses(wall_2)) {
            scoreCount += 1;
            score.innerHTML = scoreCount;
        }

        // score and highscore reset when gameOver
        if (!isGamestart) {
            if (scoreCount > highscore.innerHTML) highscore.innerHTML = scoreCount;
            scoreCount = 0
            score.innerHTML = 0;
        }

        ball.draw();
        wall_1.draw();
        wall_2.draw();

    }, 40);

}());

window.addEventListener("keydown", function (event) {
    if (isGamestart) ball.hop(event);
    if (event.key === " ") isGamestart = true;
});

// mobile control 
window.addEventListener("mousedown", function (event) {
    if (isGamestart) ball.hop(event);
    if (event.type === "mousedown") isGamestart = true;
});
