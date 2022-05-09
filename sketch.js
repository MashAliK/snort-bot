let row = window.parent.numRow, col = window.parent.numCol,
    length = window.parent.tileLength;
let borderSize = 2, fadeInSpeed = 20, fadeOutSpeed = 15     ;
player1 = {color: [255,0,0], bot: false};
player2 = {color: [0,0,255], bot: false};
turn = true; //true if it is player1's turn
let graph = new Array(row); //2d array represents graph of the game
for(let i = 0; i < row; i++){
    graph[i]= new Array(col);
}
function setup(){
    createCanvas(length*col,length*row);
    createGraph();
}

function draw(){
    stroke(0);
    let color = turn ? player1.color : player2.color;
    strokeWeight(borderSize);
    let curPos = getHover();
    for(let i = 0; i < row; i++)
        for(let j = 0; j < col; j++){
            cur = graph[i][j]
            hovered = (curPos!= undefined && curPos.curRow == i && curPos.curCol == j) ? true : false;
            if(!hovered && cur.filled==false)
                unhover(i,j)
            fill(+cur.color[0],cur.color[1],cur.color[2]);
            rect(cur.x,cur.y,length);
        }
    if(curPos!=undefined){
        hover(curPos.curRow,curPos.curCol,color);
    }
}

function mouseMoved(){ //start/stop drawing based on mouse position
    let curPos = getHover();
    if(curPos == undefined || graph[curPos.curRow][curPos.curCol].filled == true){
        noLoop();
    }
    else
        loop();
}

function mouseClicked(){
    //loop();
    let curPos = getHover();
    if(curPos == undefined) return;
    let cur = graph[curPos.curRow][curPos.curCol];
    if(cur.available == "all" && !cur.filled){
        cur.available = "none";
        cur.filled = true;
        let color = turn ? player1.color : player2.color;
        cur.color[0] = color[0];
        cur.color[1] = color[1];
        cur.color[2] = color[2];
        turn = !turn;
    }
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
    cur.color[0] = (cur.color[0] > r) ? (cur.color[0]-fadeInSpeed) : r;
    cur.color[1] = (cur.color[1] > g) ? (cur.color[1]-fadeInSpeed) : g;
    cur.color[2] = (cur.color[2] > b) ? (cur.color[2]-fadeInSpeed) : b;
    if(cur.color[0] == r && cur.color[1] == g && cur.color[2] == b)
        noLoop();
}

function unhover(i,j){
    let cur = graph[i][j];
    cur.color[0] = (cur.color[0] < 255) ? (cur.color[0]+fadeOutSpeed) : 255;
    cur.color[1] = (cur.color[1] < 255) ? (cur.color[1]+fadeOutSpeed) : 255;
    cur.color[2] = (cur.color[2] < 255) ? (cur.color[2]+fadeOutSpeed) : 255;
}

function createGraph(){
    xpos = 0;
    ypos = 0;
    for(let i = 0; i < row; i++){
        for(let j = 0; j < col; j++){
            graph[i][j] = {x:xpos,y:ypos,color:[255,255,255],filled: false, available: "all"};
            xpos += length;
        }
        xpos=0; //begin new line
        ypos += length;
    }
}
