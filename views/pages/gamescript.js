const game = document.getElementById('game');
const gameFrame = document.getElementById('game-frame');

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
            tableBody.children[i].children[1].innerHTML = ((moveList[i].player) ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-circle-fill" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="8"/></svg>` : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>`) + `${moveList[i].y+1},${moveList[i].x+1}`;
        }
    }
}

function switchTurn(turn){document.getElementById("current-move").innerHTML = `<b>${(turn ? "Black" : "White" )+ " Moves"}</b>`;}
function displayWinner(turn){document.getElementById("current-move").innerHTML = `<b>${(turn ? "Black" : "White" )+ " Wins!"}</b>`;}

window.addEventListener('message', (e) =>{
    switchTurn(e.data.curTurn);
    updateTable(e.data.moveHistory)
    if(e.data.end) displayWinner(!e.data.curTurn);
});