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
  let timerId;
  
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