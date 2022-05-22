let tileLength = 100, numRow = 1, numCol, playerOneTurn = (Math.random()<.5);
    window.tileLength = tileLength, window.updateTable = updateTable, 
    window.switchTurn = switchTurn, scrollSize = 20, window.scrollSize = scrollSize; 


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
    let game = document.createElement("iframe");
    let gameFrame = document.getElementById("game-frame");
    let infoFrame = document.getElementById("info")
    let moveDisplay = document.getElementById("current-move");
    game.setAttribute('id', 'game');
    game.setAttribute('src', 'game.html');
    game.setAttribute('title', 'Game Graph');
    gameFrame.children[0].append(game);
    game.parentElement.style.width = `${tileLength*(numCol+1)}px`;
    game.parentElement.style.height = `${tileLength*(numRow+1)}px`;
    game.style.width = '100%'; game.style.height = '100%';
    if(tileLength*(numRow+1) > height)
        game.style.transform = `scale(${height/(tileLength*(numRow+1))})`;
    infoFrame.parentElement.style.display = "inline-block";
    gameContainer.style.display = "inline";
    window.containerWidth = gameFrame.offsetWidth;
    moveDisplay.innerHTML = playerOneTurn ? "<b>White Starts</b>" : "<b>Black Starts</b>";
    //add scrollbar if iframe width exceeds container width
    if(tileLength*(numCol+1) > gameFrame.offsetWidth){
        let scroll = document.createElement("iframe");
        scroll.setAttribute('id', 'scroll');
        scroll.setAttribute('src', 'scrollbar.html');
        scroll.setAttribute('title', 'Scrollbar');
        scroll.style.height = `${scrollSize*2}px`;
        if(gameFrame.offsetWidth < numCol*scrollSize+10)
            scroll.style.transform = `scale(${gameFrame.offsetWidth/(scrollSize*(numCol+1))})`;
        scroll.style.width = `${numCol*scrollSize+10}px`;
        gameFrame.children[1].append(scroll);
    } 
}

//make sure input forms only take positive numbers between 0 and 99
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

function updateTable(history){
    let tableBody = document.getElementById("history-table-body"), moveList = new Array(tableBody.childElementCount);
    if(history.length < tableBody.childElementCount)
        for(let i = 1; i <= history.length; i++){
            moveList[i-1] = (history[history.length-i]);
    }else
        for(let i = 1; i <= tableBody.childElementCount; i++)
                moveList[i-1] = (history[history.length-i]);
    moveList.reverse();
    for(let i = 0; i < tableBody.childElementCount; i++){
        if(moveList[i] != undefined){
            tableBody.children[i].children[0].innerHTML = `${moveList[i].moveNumber}`;
            tableBody.children[i].children[1].innerHTML = ((moveList[i].player) ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>` : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-circle-fill" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="8"/>
            </svg>`) + `${moveList[i].x+1}`;
        }
    }
}

function switchTurn(turn){document.getElementById("current-move").innerHTML = `<b>${(turn ? "White" : "Black" )+ " Moves"}</b>`;}
function displayWinner(turn){document.getElementById("current-move").innerHTML = `<b>${(turn ? "White" : "Black" )+ " Wins!"}</b>`;}

document.getElementById("initialize-form").addEventListener("submit", startGame);

