let tileLength = 100, numRow = 1, numCol, playerOneTurn = (Math.random()<.5);
window.tileLength = tileLength; 

function validate(){
    numCol = parseInt(document.getElementById('colInput').value);
    if( numCol <=0 || numCol > 99)
        warn("Please enter a positive 2-digit number");
    else{
        //make variables global
        window.numCol = numCol;
        window.numRow = numRow;
        window.playerOneTurn = playerOneTurn;
        startGame();
    }
}

function startGame(){
    document.getElementById('initialize').style.display = "none";
    let height = window.innerHeight;
    let gameContainer = document.getElementById("game-container");
    let gameFrame = document.createElement("iframe");
    let infoFrame = document.getElementById("info")
    gameFrame.setAttribute('id', 'game')
    gameFrame.setAttribute('src', 'game.html')
    gameFrame.setAttribute('title', 'Game Graph')
    gameFrame.style.width = `${tileLength*(numCol+1)}px`;
    gameFrame.style.height = `${tileLength*(numRow+1)}px`;
    gameContainer.appendChild(gameFrame);
    if(tileLength*(numRow+1) > height)
        gameFrame.style.transform = `scale(${height/(tileLength*(numRow+1))})`;
    infoFrame.parentElement.style.display = "flex";
    infoFrame.children[0].innerHTML = playerOneTurn ? "White" : "Black";    
}

//make sure input forms only take positive numbers between 0 and 999
const number = document.getElementsByClassName('number');
for(let x of number){
    x.onkeydown = function(char) {
        if(!((char.keyCode > 95 && char.keyCode < 106)
          || (char.keyCode > 47 && char.keyCode < 58) 
          || char.keyCode == 8)) {
            return false;
        }
    }
    x.oninput = function(){
        if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);
    }
}

function warn(msg){
    let warnBox = document.getElementById('warning');
    warnBox.style.display = "block";
    warnBox.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
  </svg><div style="display:inline">${msg}</div>`;
}

document.getElementById("initialize-form").addEventListener("submit", startGame);

