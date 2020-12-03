const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
// ctx.fillRect(0,0,WIDTH,HEIGHT)
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
let firstDino;
let obstacles = [];
let birds = [];
let gameFlow = 0;
let score = 0;
let gameOver = false;
let FPS = 200;

const dino = document.getElementById("dino")
const dinoJump = document.getElementById("dino-jump")
const dinoSit = document.getElementById("dino-sit")
const kus = document.getElementById("kus")


///////////// CLASSES /////////////

/// DINO ///
class Dino {
  constructor() {
    this.width = 50;
    this.height = 60;
    this.x = 50;
    this.y = HEIGHT - this.height;
    this.gravity = 1;
    this.isDipping = false;
  }
  draw() {
    // ctx.fillStyle = "tomato";
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    if (this.y < HEIGHT - this.height) {
      ctx.drawImage(dinoJump, this.x, this.y)
    } else if (this.isDipping) {
      ctx.drawImage(dinoSit, this.x, this.y)
    } else {
      ctx.drawImage(dino, this.x, this.y)
    }
  }
  update() {
    this.gravity += 0.1;
    this.y += this.gravity
    if (this.y >= HEIGHT - this.height) {
      this.y = HEIGHT - this.height;
    } if (this.gravity >= 3) {
      this.gravity = 3
    }
  }
  jump() {
    if (this.y === HEIGHT - this.height) {
      this.gravity -= 7;
    }
  }
  dip() {
    this.width = 75;
    this.height = 38;
  }
  up() {
    this.width = 50;
    this.height = 60;
  }
}

/// OBSTACLE ///

class Obstacle {
  constructor() {
    this.width = Math.round(Math.random() * (45 - 30) + 30);
    this.height = Math.round(Math.random() * (60 - 40) + 40);
    this.x = WIDTH;
    this.y = HEIGHT - this.height;
  }
  draw() {
    ctx.fillStyle = "#000";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  update() {
    this.x -= 5;
  }
}

/// BIRD ///

class Bird {
  constructor() {
    this.width = 20;
    this.height = 25;
    this.space = Math.round(Math.random() * (70 - 20) + 20);
    this.x = WIDTH;
    this.y = HEIGHT - this.height - this.space;
  }
  draw() {
    // ctx.fillStyle = "yellow";
    // ctx.fillRect(this.x,this.y,this.width,this.height);
    ctx.drawImage(kus, this.x, this.y)
  }
  update() {
    this.x -= 5;
  }
}

///////////// GAME FUNCTIONS /////////////

function startGame() {
  firstDino = new Dino();
  let obst = new Obstacle();
  obstacles.push(obst);
  obst.draw();
  loop = setInterval(gameLoop, 1000 / FPS)
}

startGame();

function gameLoop() {
  update();
  draw();
}

function update() {
  // check if game is over or not
  if (gameOver) return clearInterval(loop);

  gameFlow++;
  if (gameFlow % 200 === 0) {
    let obstacle = new Obstacle();
    obstacles.push(obstacle);
  }

  if (gameFlow % 900 === 0) {
    let bird = new Bird();
    obstacles = obstacles.filter(obs => obs.x !== bird.x)
    birds.push(bird);
  }

  // remove dead obstacles
  obstacles = obstacles.filter(obs => obs.x + obs.width > 0)

  // remove dead birds
  birds = birds.filter(bird => bird.x + bird.width > 0)


  // update the score
  if (gameFlow % (FPS / 2) === 0) {
    score++;
  }

  //update Dino
  firstDino.update();

  // update obstacles
  obstacles.forEach(obs => {
    obs.update();
    // check if the dino hit any obstacle or not
    let topLeftCorner = { x: obs.x, y: obs.y };
    let topRightCorner = { x: obs.x + obs.width, y: obs.y };
    if (firstDino.x + firstDino.width >= topLeftCorner.x &&
      firstDino.x <= topRightCorner.x &&
      firstDino.y + firstDino.height >= topLeftCorner.y) {
      console.log("game is over");
      gameOver = true;
    }
  })

  birds.forEach(bird => {
    bird.update();
    let topLeftCorner = { x: bird.x, y: bird.y };
    let topRightCorner = { x: bird.x + bird.width, y: bird.y };
    let bottomRightCorner = { x: bird.x, y: bird.y + bird.width };
    if (firstDino.x + firstDino.width >= topLeftCorner.x &&
      firstDino.x <= topRightCorner.x &&
      firstDino.y + firstDino.height >= topLeftCorner.y && firstDino.y < bottomRightCorner.y) {
      console.log("game is over");
      gameOver = true;
    }
  })

  // if(obstacles[0] && obstacles[0].x - firstDino.x + firstDino.width < 200 && obstacles[0].x - firstDino.x > 10) firstDino.jump();
}

function draw() {
  // draw the canvas again
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // draw Dino
  firstDino.draw();

  // draw obstacles
  obstacles.forEach(obs => obs.draw())

  //
  birds.forEach(bird => bird.draw())

  // write score
  ctx.font = "30px Arial";
  ctx.fillText(score, 30, 50);
}

window.addEventListener("keydown", (e) => {
  // console.log(e)
  if (e.key === "" || e.key === "ArrowUp") {
    firstDino.jump();
  }
  if (e.key === "ArrowDown") {
    firstDino.isDipping = true;
    firstDino.dip();
  }
})
window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowDown") {
    firstDino.isDipping = false;
    firstDino.up();
  }
})
