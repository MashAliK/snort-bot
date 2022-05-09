let numRow = 10, numCol = 10;
window.numRow = numRow, window.numCol = numCol; //make variables global 

function startGame(){
    let height = window.innerHeight;
    let gameContainer = document.getElementById("game-container");
    let gameFrame = document.createElement("iframe");
    gameFrame.setAttribute('id', 'game')
    gameFrame.setAttribute('src', 'game.html')
    gameFrame.setAttribute('title', 'Game Graph')
    gameContainer.appendChild(gameFrame);
    //document.getElementById("game-container").style.display = "flex";
    gameFrame.style.transform = `scale(${height/1100})`;
}

startGame();
