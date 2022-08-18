//var length = (parent.document.body.clientHeight)/(parseInt(col)+1);
var length = (window.parent.document.getElementById('game').offsetWidth)/(parseInt(col)+1);

function setup(){
    createCanvas(window.parent.innerWidth,window.parent.innerHeight);
    createGraph();
    hoverEnabled = turn ? !player1.bot : !player2.bot;
    botMove();
}

function draw(){
    clear();
    length = (window.parent.document.getElementById('game').offsetWidth)/(parseInt(col)+1);
    strokeWeight(3);
    let curPos = getHover();
    for(let i = 0; i < row; i++){
        for(let j = 0; j < col; j++){
            cur = graph[i][j];
            hovered = (curPos!= undefined && curPos.curRow == i && curPos.curCol == j) ? true : false;
            if(!hovered && cur.filled==false)
                unhover(i,j);
            if(cur.filled)
                continue;
            else if(cur.available == "all"){
                drawNode(i,j,cur.color);
            }else if(cur.available == "p1")
                drawNode(i,j,cur.color);
            else if(cur.available == "p2")
                drawNode(i,j,cur.color); 
        }
    }
    if(curPos!=undefined){
        hover(curPos.curRow,curPos.curCol);
    }
}

//draws circle representing node and edges connected it
//circle size describles the size of a circle with a number between 0 and 1
function drawNode(curY, curX, color){
    let y = length*(curY+1/2), x=length*(curX+1/2), circleSize = graph[curY][curX].size;
    graph[curY][curX].x = x;
    graph[curY][curX].y = y;
    fill(color);
    let d = length*circleSize;
    if(curX != 0 && !graph[curY][curX-1].filled)
        line(x-d/2, y,x-length/2,y);
    if(curX != col-1 && !graph[curY][curX+1].filled)
        line(x+d/2, y,x+length/2,y);
    circle(x,y,d);
}
