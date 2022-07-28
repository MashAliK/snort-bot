let row = window.parent.numRow, col = window.parent.numCol, hoverEnabled = true, ambientTemp = 2,
    length = window.parent.tileLength, unFilledSize = 0.13, filledSize = 0.25, 
    availableSize = 0.45, turn = window.parent.playerOneTurn, yStart = 50, move = window.parent.moveDisplay
    updateTable = window.parent.updateTable, moveNum = 0, switchTurn = window.parent.switchTurn, finished = false,
    displayWinner = window.parent.displayWinner, top.setScroll = setScroll, top.getScroll = getScroll, 
    leftScrollOff = window.parent.leftScrollOff, rightScrollOff = window.parent.rightScrollOff;

player1 = {color: 0, bot: false};
player2 = {color: 255, bot: true};
let history = [];
let game = {firstMove:turn, moveHistory:history};
let graph = new Array(row); //2d array represents graph of the game
for(let i = 0; i < row; i++){
    graph[i]= new Array(col);
}

function mouseMoved(){ //start/stop drawing based on mouse position
    let curPos = getHover();
    if(curPos == undefined)
        clearHighlight();
    else if(!graph[curPos.curRow][curPos.curCol].filled)
        loop();
}

function playerMove(curRow, curCol){
    let cur = graph[curRow][curCol];
    cur.available = turn ? "p1" : "p2";
    cur.filled = true;
    cur.color = turn ? player1.color : player2.color;
    nodeClaimed(curRow,curCol);
    history.push({moveNumber:++moveNum,player: turn, x:curCol,y:curRow})
    turn = !turn;
    hoverEnabled = (turn) ? !player1.bot : !player2.bot;
    switchTurn(turn);
    updateTable(history);
    checkWin()
    document.body.style.cursor = 'default';
}

function mouseClicked(){
    if(finished || !hoverEnabled) return;
    let curPos = getHover();
    if(curPos == undefined) return;
    let cur = graph[curPos.curRow][curPos.curCol];
    if(cur.filled)
        return
    if((cur.available == "all") || (cur.available == "p1" && turn) || (cur.available == "p2" && !turn))
        playerMove(curPos.curRow,curPos.curCol);
    clearHighlight();
    clear();
    redraw();
    botMove();
}

function graphToChain(graphrow){
    const nodeType = (available) => {
        if(available === "p1")
                return "L";
            else if(available === "p2")
                return "R";
            else
                return "U";
    }
    var chains = [];
    var curChain = {start: "", len: 0, end: ""};
    const pushChain = (i) =>{ //add curChain and reset it
        curChain.end = nodeType(graphrow[i-1].available); 
        chains.push(curChain.start+curChain.len.toString()+curChain.end);
        curChain.len = 0;
    }
    for(var i = 0; i < col; i++){
        if(graphrow[i].filled){
            if(curChain.len === 0)
                continue;
            pushChain(i);
        }
        else if(curChain.len === 0 && graphrow[i].available != "none"){ //new chain
            curChain.start = nodeType(graphrow[i].available);
            curChain.len = 1;
        }else if(curChain.len > 0)
            curChain.len++;

    }
    if(curChain.len > 0)
        pushChain(col);
    return chains;
}

function botMove(){
    if(!(turn && player1.bot) && !(!turn && player2.bot) || finished)
        return;
    var chains = graphToChain(graph[0]);
    var numOnly = true;
    for(const c of chains)
        if(parseInt(c.slice(1,-1)) > 2)
            numOnly = false;
    if(numOnly)
        ambientTemp = 0;
    var socket = io();
    socket.emit('optimalMove',[graphToChain(graph[0]),null,turn,ambientTemp], (resp) =>{
        playerMove(0,componentToPosition(resp.move));
    });
    loop();
}

function checkWin(){ //check if a player has won
    for(let i = 0; i < row; i++)
        for(let j = 0; j < col; j++){
            let cur = graph[i][j];
            if(!cur.filled && (cur.available == "all" || (cur.available == "p1" && turn) || (cur.available == "p2" && !turn)))
                return;
        }
    finished = true;
    displayWinner(!turn);
}

function componentToPosition(comp){
    var compCount = -1;
    var inComp = false;
    var i = -1;
    for(const node of graph[0]){
        i++;
        if(inComp){
            if(node.available === "none" || node.filled)
                inComp = false;
            else 
                continue;
        }else if(node.available != "none" && !node.filled){
            compCount++;
            if(compCount === comp[0])
                return i+comp[1];
            inComp = true;
        }
    }
}

function getHover(){ //returns square that is hovered by the mouse
    let x = mouseX, y = mouseY;
    if(x>=length*col || y>=length*row+yStart || x<0 || y<yStart) return undefined;
    let curCol = Math.floor(x/length), curRow = Math.floor((y-yStart)/length);
    return {curRow,curCol};
}

function hover(i,j){
    if(!hoverEnabled)
        return;
    let cur = graph[i][j];
    if(cur.filled == true ) return;
    if(cur.available == "all"){
        cur.size = (cur.size < filledSize) ? cur.size+0.01 : filledSize;
        cur.color = turn ? player1.color : player2.color;
        document.body.style.cursor = 'pointer';
    } else if((cur.available == "p1" && turn) || (cur.available == "p2" && !turn)){
        cur.size = (cur.size > filledSize) ? cur.size-0.01 : filledSize;
        document.body.style.cursor = 'pointer';
    }
    if((cur.available == "all" || cur.available == "p1" || cur.available == "p2") && cur.size == filledSize
        || (cur.available == "p1" && !turn) || (cur.available == "p2" && turn))
        clearHighlight();
}

function unhover(i,j){
    let cur = graph[i][j];
    if(cur.filled == true || cur.available == "none") return;
    if(cur.available == "all"){
        cur.color = 0; 
        cur.size = (cur.size > unFilledSize) ? cur.size-0.01 : unFilledSize;
        document.body.style.cursor = 'default';
    }else if(cur.available == "p1" || cur.available == "p2"){
        cur.size = (cur.size < availableSize) ? cur.size+0.01 : availableSize;
        document.body.style.cursor = 'default';
    }
    
}

function clearHighlight(){ //completes fadeout animation before program stops drawing 
    if(window.parent.scrollState != 0) return;
    let curHovered = getHover();
    for(let i = 0; i < row; i++){
        for(let j = 0; j < col; j++){
            //skip current vertex being hovered
            if(curHovered != undefined && curHovered.curRow == i && curHovered.curCol == j)
                continue;
            let cur = graph[i][j];
            while(!cur.filled && ((cur.available == "all" && cur.size != unFilledSize)
                || ((cur.available == "p1" || cur.available == "p2") && cur.size != availableSize))){
                unhover(i,j);
            }
        }
    }
    noLoop();
}

function nodeClaimed(x,y){
    for(let i of getConnected(x,y)){
        if(i.filled) continue;
        if((i.available=="p1" && !turn) || (i.available=="p2" && turn))
            i.available = "none";
        else if(i.available != "none"){
            i.available = turn ? "p1" : "p2";
            i.color = turn ? player1.color : player2.color;
            cur.size = availableSize;
        }
    }
}

function getConnected(x, y){ //get all nodes connected to the current node by an edge
    connectedNodes = [];
    for(let h = 0; h < graph[x][y].connected.edgeCol.length; h++)
            connectedNodes.push(graph[graph[x][y].connected.edgeRow[h]]
                [graph[x][y].connected.edgeCol[h]]);
    return connectedNodes;
}

function addEdge(node,x,y){
    node.connected.edgeRow.push(x);
    node.connected.edgeCol.push(y);
}

function setScroll(x){scrollTo(x*length,0);}
//start and end are the first and last nodes visible on the users screen
function getScroll(){return {start: Math.ceil(scrollX/length), end: Math.floor((scrollX+window.parent.containerWidth)/length)};}

/*available property has four states:
1. all: either player can play here
2. p1/p2: only one of the players can play here
3. none: neither player can play here
*/
function createGraph(){
    xpos = 0;
    ypos = yStart;
    for(let i = 0; i < row; i++){
        for(let j = 0; j < col; j++){
            //if not filled available describes which player can still fill it
            //otherwise available describes which color it is filled by
            if(j === 0)
                graph[i][j] = {x:xpos,y:ypos,color: player1.color, size: unFilledSize,
                    filled: false, available: "p1", connected: {edgeRow:[],edgeCol:[]}};
            else if (j === col-1)
                graph[i][j] = {x:xpos,y:ypos,color: player2.color, size: unFilledSize,
                    filled: false, available: "p2", connected: {edgeRow:[],edgeCol:[]}};
            else
                graph[i][j] = {x:xpos,y:ypos,color: 0, size: unFilledSize,
                    filled: false, available: "all", connected: {edgeRow:[],edgeCol:[]}};
            if(i != 0)
                addEdge(graph[i][j],i-1,j);
            if(i != row-1)
                addEdge(graph[i][j],i+1,j);
            if(j != 0)
                addEdge(graph[i][j],i,j-1);
            if(j != col-1)
                addEdge(graph[i][j],i,j+1);
            xpos += length;
        }
        xpos=0; //begin new line
        ypos += length;
    }
    top.graph = graph;
}