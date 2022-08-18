const unFilledSize = 0.13, filledSize = 0.25, availableSize = 0.45, yStart = 50;
var finished = false, hoverEnabled = true, moveNum = 0;
const params = new Proxy(new URLSearchParams(window.location.search),{
    get: (searchParams, prop) => searchParams.get(prop),
});
const col = params.col, row = params.row, history = [];
player1 = {color: 0,   bot: params.p1bot == 'true',  prevTemp: null};
player2 = {color: 255, bot: params.p2bot == 'true',  prevTemp: null};
var graph, turn = (Math.random()<.5), newChains = null;
const game = {numCol:col,numRow:row,curTurn:turn,moveHistory:history,end:finished};

function mouseMoved(){ //start or stop drawing based on mouse position
    let curPos = getHover();
    if(curPos == undefined)
        clearHighlight();
    else if(!graph[curPos.curRow][curPos.curCol].filled)
        loop();
}

function playerMove(curRow, curCol){
    let cur = graph[curRow][curCol];
    moveRange = getChainIndex(curRow, curCol);
    cur.available = turn ? "p1" : "p2";
    cur.filled = true;
    cur.color = turn ? player1.color : player2.color;
    nodeClaimed(curRow,curCol);
    newLeftChain = graphToChain(graph[0],moveRange[0],curCol);
    newRightChain = graphToChain(graph[0],curCol,moveRange[1]);
    newLeftChain = (newLeftChain.length === 0) ? null : newLeftChain[0];
    newRightChain = (newRightChain.length === 0) ? null : newRightChain[0];
    newChains = [newLeftChain, newRightChain];
    history.push({moveNumber: ++moveNum, player: turn, x:curCol, y:curRow});
    turn = !turn;
    hoverEnabled = (turn) ? !player1.bot : !player2.bot;
    checkWin();
    game.curTurn = turn;
    game.end = finished;
    parent.postMessage(game,"*");
    document.body.style.cursor = 'default';
    botMove();
}

function mouseClicked(){
    if(finished || !hoverEnabled) return;
    let curPos = getHover();
    if(curPos == undefined) return;
    let cur = graph[curPos.curRow][curPos.curCol];
    if(cur.filled)
        return;
    if((cur.available == "all") || (cur.available == "p1" && turn) || (cur.available == "p2" && !turn))
        playerMove(curPos.curRow,curPos.curCol);
    clearHighlight();
    clear();
    redraw();
}

function graphToChain(graphrow, start, end){
    if(start == undefined)
        start = 0;
    if(end == undefined)
        end = col
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
    const pushChain = (i) => { //add curChain and reset it
        curChain.end = nodeType(graphrow[i-1].available); 
        chains.push(curChain.start+curChain.len.toString()+curChain.end);
        curChain.len = 0;
    };
    for(var i = start; i < end; i++){
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
        pushChain(end);
    return chains;
}

function botMove(){
    if((!(turn && player1.bot) && !(!turn && player2.bot)) || finished)
        return;
    var socket = io();
    var curP = turn ? player1 : player2;
    ambientTemp = Math.min(...curP.prevTemp);
    socket.emit('optimalMove',[graphToChain(graph[0]),newChains,turn,ambientTemp], (resp) =>{
        curP.prevTemp.add(resp.move[2]);
        playerMove(0,componentToPosition(resp.move));
        redraw();
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
    if(x >= (length*col) || y >= (length*row) || x <= 0 || y <= 0) return undefined;
    let curCol = Math.floor(x/length), curRow = Math.floor(y/length);
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
            i.chainEnd = true;
            i.color = turn ? player1.color : player2.color;
            i.size = availableSize;
        }
    }
}

function getChainIndex(x, y){
    var start = 0, end = col-1;
    for(var i = 0; i < col; i++){
        if(i <= y && graph[x][i].chainEnd && graph[x][i].available != "none" && !graph[x][i].filled){
            if(i == y && ((i == col-1) || (graph[x][i+1].available == "none" || graph[x][i+1].filled))){
                if(i == 0 || (graph[x][i-1].available == "none" || graph[x][i-1].filled))
                    return [y,y+1];
                else
                    return [start,y+1];
            }
            start = i;
        }
        if(i >= y && graph[x][i].chainEnd && graph[x][i].available != "none" && !graph[x][i].filled){
            end = i;
            break;
        }
    }
    return [start,end+1];
}

function getConnected(x, y){ //get all nodes connected to the current node by an edge
    var connectedNodes = [];
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
    graph = new Array(row); //2d array represents graph of the game
    for(let i = 0; i < row; i++){
        graph[i]= new Array(col);
    }
    player1.prevTemp = new Set();
    player2.prevTemp = new Set();
    player1.prevTemp.add(2);
    player2.prevTemp.add(2);
    xpos = length/2;
    ypos = length/2;
    for(let i = 0; i < row; i++){
        for(let j = 0; j < col; j++){
            //if not filled available describes which player can still fill it
            //otherwise available describes which color it is filled by
            if(j === 0)
                graph[i][j] = {x:xpos,y:ypos,color: player1.color, size: unFilledSize,
                    filled: false, available: "p1", connected: {edgeRow:[],edgeCol:[]}
                    ,chainEnd: true};
            else if (j === col-1)
                graph[i][j] = {x:xpos,y:ypos,color: player2.color, size: unFilledSize,
                    filled: false, available: "p2", connected: {edgeRow:[],edgeCol:[]}
                    ,chainEnd: true};
            else
                graph[i][j] = {x:xpos,y:ypos,color: 0, size: unFilledSize,
                    filled: false, available: "all", connected: {edgeRow:[],edgeCol:[]}
                    ,chainEnd: false};
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
        xpos = length/2; //begin new line
        ypos += length;
    }
    top.graph = graph;
}