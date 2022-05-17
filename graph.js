let row = window.parent.numRow, col = window.parent.numCol,
    length = window.parent.tileLength, unFilledSize = 0.13, filledSize = 0.25, 
    availableSize = 0.45, turn = window.parent.playerOneTurn, yStart = 50; 
player1 = {color: 255, bot: false};
player2 = {color: 0, bot: false};

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

function mouseClicked(){
    let curPos = getHover();
    if(curPos == undefined) return;
    let cur = graph[curPos.curRow][curPos.curCol];
    if(cur.filled) return; 
    if((cur.available == "all") || (cur.available == "p1" && turn) || (cur.available == "p2" && !turn)){
        cur.available = turn ? "p1" : "p2";
        cur.filled = true;
        cur.color = turn ? player1.color : player2.color;
        nodeClaimed(curPos.curRow,curPos.curCol);
        turn = !turn;
    }
    clearHighlight();
    clear();
    redraw();
}

function getHover(){ //returns square that is hovered by the mouse
    let x = mouseX, y = mouseY;
    if(x>=length*col || y>=length*row+yStart || x<0 || y<yStart) return undefined;
    let curCol = Math.floor(x/length), curRow = Math.floor((y-yStart)/length);
    return {curRow,curCol};
}

function hover(i,j){
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
}