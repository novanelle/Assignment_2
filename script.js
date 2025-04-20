let biteSound;
let dog;
let bone;
let gridSize = 20;
let cols, rows;

let snakeHeadEmoji = "🐶";

function preload() {
  soundFormats('mp3');
  biteSound = loadSound('bite.mp3');
}

function setup() {
  createCanvas(400, 400);
  frameRate(10);
  cols = floor(width / gridSize);
  rows = floor(height / gridSize);
  resetGame();
}

function resetGame() {
  dog = new Dog();
  placeBone();
  loop();
}

function draw() {
  background(245, 235, 220);

  dog.update();
  drawSnake();
  drawFood();

  if (dog.eat(bone)) {
    biteSound.play(); // Play the sound once
    placeBone();      // Place a new bone once
  }

  if (dog.hitSelf() || dog.hitWall()) {
    noLoop();

    fill(0, 0, 0, 150); // Background for text
    rect(0, height / 2 - 60, width, 120);

    textSize(32);
    fill(200, 0, 0);
    textAlign(CENTER, CENTER);
    text("Game Over 🐾", width / 2, height / 2 - 20);

    textSize(16);
    fill(255);
    text("Click Restart or press R", width / 2, height / 2 + 20);
  }
}

function placeBone() {
  let x = floor(random(cols)) * gridSize;
  let y = floor(random(rows)) * gridSize;
  bone = createVector(x, y);
}

function keyPressed() {
  if (keyCode === UP_ARROW && dog.ydir !== 1) {
    dog.setDir(0, -1);
  } else if (keyCode === DOWN_ARROW && dog.ydir !== -1) {
    dog.setDir(0, 1);
  } else if (keyCode === LEFT_ARROW && dog.xdir !== 1) {
    dog.setDir(-1, 0);
  } else if (keyCode === RIGHT_ARROW && dog.xdir !== -1) {
    dog.setDir(1, 0);
  } else if (key === 'r' || key === 'R') {
    resetGame();
  }
}

function drawSnake() {
  for (let i = 0; i < dog.body.length; i++) {
    if (i === dog.body.length - 1) {
      textSize(gridSize);
      textAlign(CENTER, CENTER);
      text(snakeHeadEmoji, dog.body[i].x + gridSize / 2, dog.body[i].y + gridSize / 2);
    } else {
      fill("#8B4513");
      ellipse(dog.body[i].x + gridSize / 2, dog.body[i].y + gridSize / 2, gridSize, gridSize);
    }
  }
}

function drawFood() {
  textSize(gridSize);
  textAlign(CENTER, CENTER);
  text("🦴", bone.x + gridSize / 2, bone.y + gridSize / 2);
}

// Button for restarting the game
document.getElementById("restart-button").addEventListener("click", () => {
  resetGame();
});

class Dog {
  constructor() {
    this.body = [];
    this.body[0] = createVector(floor(cols / 2) * gridSize, floor(rows / 2) * gridSize);
    this.xdir = 1;
    this.ydir = 0;
    this.len = 1;
  }

  setDir(x, y) {
    this.xdir = x;
    this.ydir = y;
  }

  update() {
    let head = this.body[this.body.length - 1].copy();
    head.x += this.xdir * gridSize;
    head.y += this.ydir * gridSize;
    this.body.push(head);

    if (this.body.length > this.len) {
      this.body.shift();
    }
  }

  eat(pos) {
    let head = this.body[this.body.length - 1];
    if (head.x === pos.x && head.y === pos.y) {
      this.len++;
      return true;
    }
    return false;
  }

  hitSelf() {
    let head = this.body[this.body.length - 1];
    for (let i = 0; i < this.body.length - 1; i++) {
      let part = this.body[i];
      if (head.x === part.x && head.y === part.y) {
        return true;
      }
    }
    return false;
  }

  hitWall() {
    let head = this.body[this.body.length - 1];
    return (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height);
  }
}
