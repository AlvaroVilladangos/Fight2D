const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

class Sprite {
  constructor({ position, velocity, color, offset }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.isJumping = false;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: offset,
      width: 100,
      height: 50,
    };
    this.color = color;
    this.isAttacking = false;
    this.health = 100;
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    //attack box

    if (this.isAttacking) {
      c.fillStyle = "yellow";
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }

  update() {
    this.draw();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
      this.isJumping = false;
    } else {
      this.velocity.y += gravity;
      this.isJumping = true;
    }
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

const player = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "lightblue",
  offset: {
    x: 0,
    y: 0,
  },
});

const enemy = new Sprite({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "red",
  offset: {
    x: -50,
    y: 0,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },

  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

function collisionAtaques({ jugador, enemigo }) {
  return (
    jugador.attackBox.position.x + jugador.attackBox.width >=
      enemigo.position.x &&
    jugador.attackBox.position.x <= enemigo.position.x + enemigo.width &&
    jugador.attackBox.position.y + jugador.attackBox.height >=
      enemigo.position.y &&
    jugador.attackBox.position.y <= enemigo.position.y + enemigo.height
  );
}

function determineWinner({player, enemy, timerId}){
  clearTimeout(timerId);
  document.querySelector("#displayText").style.display = "flex";

  if (player.health === enemy.health){
    document.querySelector("#displayText").innerHTML = "TIE";
  } else if (player.health > enemy.health){
    document.querySelector("#displayText").innerHTML = "PLAYER 1 WINS";
  }else if (enemy.health > player.health){
    document.querySelector("#displayText").innerHTML = "PLAYER 2 WINS";
  }
}

let timer= 100;
let timerId
function decreaseTimer(){
  if (timer >0){
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }

  if (timer ===0) {
    determineWinner({player, enemy, timerId});
  }
}

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;
  //movimiento jugador
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
  }

  //movimiento enemigo
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
  }

  //coque entre unidades
  if (
    collisionAtaques({ jugador: player, enemigo: enemy }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.health -=20;
    document.querySelector('#enemyHealth').style.width =  enemy.health + "%"
  }

  if (
    collisionAtaques({ jugador: enemy, enemigo: player }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health -=20;
    document.querySelector('#playerHealth').style.width =  player.health + "%"
  }

  //end gaME BASED OF HEALTH

  if(enemy.health <=0 || player.health <=0){
    determineWinner({player, enemy, timerId})
  }
}

animate();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
      if (!player.isJumping) {
        player.velocity.y = -20;
      }
      break;
    case " ":
      player.attack();
      break;

    //enemigo
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      if (!enemy.isJumping) {
        enemy.velocity.y = -20;
      }
      break;
    case "ArrowDown":
      enemy.attack();
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;

    //enemigo
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowUp":
      keys.w.pressed = false;
      break;
  }
});
