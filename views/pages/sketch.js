function setup(){
    createCanvas(length*col,length*row+50);
    createGraph();
    hoverEnabled = turn ? !player1.bot : !player2.bot;
    botMove();
}

function draw(){
    clear();
    scrollState = window.parent.scrollState;
    if(scrollState == 1 && getScroll().start <= 0) leftScrollOff(true); else if(getScroll().start > 0) leftScrollOff(false);
    if(scrollState == 2 && getScroll().end >= col)  rightScrollOff(true); 
    else if(getScroll().end < col) rightScrollOff(false);
    if(scrollState == 1) scrollTo(scrollX-15,0); else if(scrollState == 2) scrollTo(scrollX+15,0);
    textAlign(CENTER);
    strokeWeight(3);
    let curPos = getHover();
    for(let i = 0; i < row; i++){
        for(let j = 0; j < col; j++){
            if(i == 0){
                fill(0);
                text(`${j+1}`,length/2-1+j*length,length*0.6);
            }
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
function drawNode(curX, curY, color){
    let x = graph[curX][curY].x, y = graph[curX][curY].y, circleSize = graph[curX][curY].size;
    fill(color);
    let d = length*circleSize;
    let lineLength =  0.5*length*(1-circleSize);
    circle(x+length/2,y+length/2,d);
    if(curY != 0 && !graph[curX][curY-1].filled)
        line(x, y+length/2,x+lineLength,y+length/2);
    if(curY != col-1 && !graph[curX][curY+1].filled)
        line(x+d+lineLength, y+length/2,x+length,y+length/2);
    if(curX != 0 && !graph[curX-1][curY].filled)
        line(x+length/2, y,x+length/2,y+lineLength); 
    if(curX != 0 && !graph[curX+1][curY].filled)
        line(x+length/2, y+d+lineLength,x+length/2,y+length);
}
