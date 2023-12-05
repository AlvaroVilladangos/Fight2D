const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 1;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./Assets/background.png",
});

const shop = new Sprite({
  position: {
    x: 650,
    y: 160,
  },
  imageSrc: "./Assets/shop.png",
  scale: 2.5,
  framesMax: 6,
});

const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "orange",
  offset: {
    x: 0,
    y: 0,
  },

  imageSrc: "./Assets/samuraiMack/Idle.png",
  scale: 2.5,
  framesMax: 8,
  offset: { x: 215, y: 157 },
  sprites: {
    idle: {
      imageSrc: "./Assets/samuraiMack/Idle.png",
      framesMax: 8,
    },

    run: {
      imageSrc: "./Assets/samuraiMack/Run.png",
      framesMax: 8,
    },

    jump: {
      imageSrc: "./Assets/samuraiMack/Jump.png",
      framesMax: 2,
    },

    fall: {
      imageSrc: "./Assets/samuraiMack/Fall.png",
      framesMax: 2,
    },

    attack1: {
      imageSrc: "./Assets/samuraiMack/Attack1.png",
      framesMax: 6,
    },
  },

  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 170,
    height: 50,
  },
});

const enemy = new Fighter({
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

  imageSrc: "./Assets/kenji/Idle.png",
  scale: 2.5,
  framesMax: 4,
  offset: { x: 215, y: 167 },
  sprites: {
    idle: {
      imageSrc: "./Assets/kenji/Idle.png",
      framesMax: 4,
    },

    run: {
      imageSrc: "./Assets/kenji/Run.png",
      framesMax: 8,
    },

    jump: {
      imageSrc: "./Assets/kenji/Jump.png",
      framesMax: 2,
    },

    fall: {
      imageSrc: "./Assets/kenji/Fall.png",
      framesMax: 2,
    },

    attack1: {
      imageSrc: "./Assets/kenji/Attack1.png",
      framesMax: 4,
    },
  },

  attackBox: {
    offset: {
      x: -165,
      y: 50,
    },
    width: 170,
    height: 50,
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

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;
  //movimiento jugador

  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  //jumping
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  //movimiento

  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  //jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  //choque entre unidades
  if (
    collisionAtaques({ jugador: player, enemigo: enemy }) &&
    player.isAttacking && player.framesCurrent === 4
  ) {
    player.isAttacking = false;
    enemy.health -= 20;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  // if playere misses

  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }


  if (
    collisionAtaques({ jugador: enemy, enemigo: player }) &&
    enemy.isAttacking && player.framesCurrent === 2
  ) {
    enemy.isAttacking = false;
    player.health -= 15;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }


  //end gaME BASED OF HEALTH

  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
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
