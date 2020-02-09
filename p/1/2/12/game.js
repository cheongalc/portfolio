var backgroundAudio = new Audio("background music.mp3");
backgroundAudio.volume = 0.4;
backgroundAudio.addEventListener('ended', function() {
	this.currentTime = 0;
	this.play();
});
backgroundAudio.play();
var snakeBlip = new Audio("snake blip.mp3");
snakeBlip.volume = 0.2;
var fruitSFX = new Audio("fruit sfx.mp3");
fruitSFX.volume = 0.2;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var scoreContainer = document.getElementById("scoreContainer");
var startContainer = document.getElementById("startContainer");

var gameOver = false;
var keyboardTouched = false;
var toggle = true;
var backgroundAudioToggle = true;

const width = 1280, headWidth = 20, fruitWidth = 20;
const height = 680, headHeight = 20, fruitHeight = 20;

var headX, headY, tailX = [], tailY = [], fruitX, fruitY;
var score, tailLength = 0, snakeDir, delta = 5;
var STOP = 0, LEFT = 1, RIGHT = 2, DOWN = 3, UP = 4;

main();

function draw() {
	ctx.clearRect(0, 0, 1280,680);

	// game borders

	ctx.strokeStyle = "#FFFFFF";
	ctx.lineWidth = 10;
	ctx.strokeRect(0, 0, 1280, 680);

	// draw snake head

	ctx.fillStyle = "#00FF00";
	ctx.fillRect(headX - headWidth/2, headY - headHeight/2, headWidth, headHeight);

	// draw tail
	ctx.fillStyle = "#00AA00";
	for (i = 0; i < tailLength; i++) {
		ctx.fillRect(tailX[i] - headWidth/2, tailY[i] - headHeight/2, headWidth, headHeight);
	}

	// draw fruit 

	ctx.fillStyle = "#FF0000";
	ctx.fillRect(fruitX - fruitWidth/2, fruitY - fruitHeight/2, fruitWidth, fruitHeight);

	// update score text
	scoreContainer.innerHTML = score;

	if (keyboardTouched) {
		startContainer.innerHTML = "TOGGLE SPACE TO SEE MAP CLEARLY";
		setTimeout(function() {
			startContainer.style.display = "none";
			scoreContainer.style.top = "50%";
			scoreContainer.style.transform = "translate(-50%, -50%)";
		}, 3000);
	}
}

function init() {
	gameOver = false;
	snakeDir = STOP;
	tailX = [];
	tailY = [];
	headX = width / 2;
	headY = height / 2;
	fruitX = Math.floor(Math.random() * width-20) + 20;
	fruitY = Math.floor(Math.random() * height-20) + 20;
	score = 0;
}

function logic() {

	var prevX = tailX[0]; // previous x and y coord of the tail
	var prevY = tailY[0];
	var prevTempX, prevTempY;

	// switch (snakeDir) {
	// 	case UP:
	// 		tailX[0] = headX;
	// 		tailY[0] = headY + headHeight;
	// 		break;
	// 	case LEFT:
	// 		tailX[0] = headX + headWidth;
	// 		tailY[0] = headY;
	// 		break;
	// 	case DOWN:
	// 		tailX[0] = headX;
	// 		tailY[0] = headY - headHeight;
	// 		break;
	// 	case RIGHT:
	// 		tailX[0] = headX - headWidth;
	// 		tailY[0] = headY;
	// 		break;
	// }

	tailX[0] = headX;
	tailY[0] = headY;

	for (i = 1; i < tailLength; i++) {
		prevTempX = tailX[i];
		prevTempY = tailY[i];
		// switch (snakeDir) {
		// 	case UP:
		// 		tailX[i] = prevX;
		// 		tailY[i] = prevY + headHeight;
		// 		break;
		// 	case LEFT:
		// 		tailX[i] = prevX + headWidth;
		// 		tailY[i] = prevY;
		// 		break;
		// 	case DOWN:
		// 		tailX[i] = prevX;
		// 		tailY[i] = prevY - headHeight;
		// 		break;
		// 	case RIGHT:
		// 		tailX[i] = prevX - headWidth;
		// 		tailY[i] = prevY;
		// 		break;
		// }
		tailX[i] = prevX;
		tailY[i] = prevY;

		prevX = prevTempX;
		prevY = prevTempY;
	}

	switch (snakeDir) {
		case UP:
			headY-=delta;
			break;
		case LEFT:
			headX-=delta;
			break;
		case DOWN:
			headY+=delta;
			break;
		case RIGHT:
			headX+=delta;
			break;
	}

	if (headX > width || headX < 0 || headY > height || headY < 0) {
		displayDieMessage();
	}

	if (checkCollision(headX, headY, fruitX, fruitY, fruitWidth, fruitHeight)) {
		fruitSFX.currentTime = 0;
		fruitSFX.play();
		score+=10;
		fruitX = Math.floor(Math.random() * width-20) + 10;
		fruitY = Math.floor(Math.random() * height-20) + 10;
		tailLength+=5;
	}
		
	for (i = 0; i < tailLength; i++) {
		if (checkCollision(headX, headY, tailX[i], tailY[i], 0, 0)) {
			gameOver = true;
			displayDieMessage();
		}
	}

}

function checkCollision(clientX, clientY, targetX, targetY, bufferX, bufferY) {
	if (targetX - bufferX <= clientX && clientX <= targetX + bufferX) {
		if (targetY - bufferY <= clientY && clientY <= targetY + bufferY) {
			return true;
		}
	}
	return false;
}

function handleInput(event) {
	var kc = event.which || event.keyCode;
	switch (kc) {
		case 87:
			//"w"
			keyboardTouched = true;
			snakeDir = UP;
			snakeBlip.currentTime = 0;
			snakeBlip.play();
			break;
		case 65:
			//"a"
			keyboardTouched = true;
			snakeDir = LEFT;
			snakeBlip.currentTime = 0;
			snakeBlip.play();
			break;
		case 83:
			//"s"
			keyboardTouched = true;
			snakeDir = DOWN;
			snakeBlip.currentTime = 0;
			snakeBlip.play();
			break;
		case 68:
			//"d";
			keyboardTouched = true;
			snakeDir = RIGHT;
			snakeBlip.currentTime = 0;
			snakeBlip.play();
			break;
		case 88:
			gameOver = true;
			scoreContainer.innerHTML = "GAME QUITTED";
			break;
		case 32:
			if (toggle) {
				scoreContainer.style.color = "rgba(255,255,255,1.0)";
				toggle = false;
			} else {
				scoreContainer.style.color = "rgba(255,255,255,0.3)";
				toggle = true;
			}
			break;
		case 76:
			if (backgroundAudioToggle) {
				backgroundAudio.volume = 0.4;
				snakeBlip.volume = 0.2;
				backgroundAudioToggle = false;
			} else {
				backgroundAudio.volume = 0;
				snakeBlip.volume = 0.4;
				backgroundAudioToggle = true;
			}
	}
}

function displayDieMessage() {
	gameOver = true;
	scoreContainer.innerHTML = "GAME OVER";
	setTimeout(function(){location.reload()}, 3000);
}

function main() {
	init();
	var recur = function () {
		draw();
		logic();
		if (!gameOver) requestAnimationFrame(recur);
	}
	requestAnimationFrame(recur);
}