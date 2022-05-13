let row = window.parent.numRow, col = window.parent.numCol,
    length = window.parent.tileLength, fadeSpeed = 20;
player1 = {color: [0,0,255], bot: false};
player2 = {color: [255,0,0], bot: false};
turn = true; //true if it is player1's turn
let graph = new Array(row); //2d array represents graph of the game
for(let i = 0; i < row; i++){
    graph[i]= new Array(col);
}

function mouseMoved(){ //start/stop drawing based on mouse position
    let curPos = getHover();
    if(curPos != undefined && !graph[curPos.curRow][curPos.curCol].filled)
        loop();
    else{
        clearHighlight();
    }
}

function mouseClicked(){
    let curPos = getHover();
    if(curPos == undefined) return;
    let cur = graph[curPos.curRow][curPos.curCol];
    if(cur.filled) return; 
    if((cur.available == "all") || (cur.available == "p1" && turn) || (cur.available == "p2" && !turn)){
        cur.available = turn ? "p1" : "p2";
        cur.filled = true;
        let color = turn ? player1.color : player2.color;
        cur.color[0] = color[0];
        cur.color[1] = color[1];
        cur.color[2] = color[2];
        nodeClaimed(curPos.curRow,curPos.curCol);
        turn = !turn;
    }
    clear();
    redraw();
}

function getHover(){ //returns square that is hovered by the mouse
    let x = mouseX, y = mouseY;
    if(x>=length*col || y>=length*row || x<0 || y<0) return undefined;
    let curCol = Math.floor(x/length), curRow = Math.floor(y/length);
    return {curRow,curCol};
}

function hover(i,j,[r,g,b]){
    let cur = graph[i][j];
    if(cur.filled == true) return;
    cur.color[0] = (cur.color[0] < r) ? (cur.color[0]+fadeSpeed) : r;
    cur.color[1] = (cur.color[1] < g) ? (cur.color[1]+fadeSpeed) : g;
    cur.color[2] = (cur.color[2] < b) ? (cur.color[2]+fadeSpeed) : b;
    if(cur.color[0] == r && cur.color[1] == g && cur.color[2] == b)
        clearHighlight();
}

function unhover(i,j){
    let cur = graph[i][j];
    cur.color[0] = (cur.color[0] > 0) ? (cur.color[0]-fadeSpeed) : 0;
    cur.color[1] = (cur.color[1] > 0) ? (cur.color[1]-fadeSpeed) : 0;
    cur.color[2] = (cur.color[2] > 0) ? (cur.color[2]-fadeSpeed) : 0;
}

function clearHighlight(){ //completes fadeout animation before program stops drawing
    let curHovered = getHover();
    for(let i = 0; i < row; i++){
        for(let j = 0; j < col; j++){
            //skip current vertex being hovered
            if(curHovered != undefined && curHovered.curRow == i && curHovered.curCol == j)
                continue;
            let cur = graph[i][j];
            while(!cur.filled && (cur.color[0]!=0 || cur.color[1]!=0 || cur.color[2]!=0)){
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
        else if(i.available != "none")
            i.available = turn ? "p1" : "p2";
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
    ypos = 0;
    for(let i = 0; i < row; i++){
        for(let j = 0; j < col; j++){
            //if not filled available describes which player can still fill it
            //otherwise available describes which color it is filled by
            graph[i][j] = {x:xpos,y:ypos,color:[0,0,0],
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