function setup(){
    createCanvas(length*col,length*row);
    createGraph();
}

function draw(){
    clear();
    let color = turn ? player1.color : player2.color; 
    strokeWeight(3);
    let curPos = getHover();
    for(let i = 0; i < row; i++)
        for(let j = 0; j < col; j++){
            cur = graph[i][j]
            hovered = (curPos!= undefined && curPos.curRow == i && curPos.curCol == j) ? true : false;
            if(!hovered && cur.filled==false)
                unhover(i,j);
            if(cur.filled)
                drawNode(cur.x,cur.y,filledSize,i,j, cur.color);
            else if(cur.available == "all"){
                drawNode(cur.x,cur.y,cur.size,i,j,cur.color);
            }else if(cur.available == "p1")
                drawNode(cur.x,cur.y,cur.size,i,j,255);
            else if(cur.available == "p2")
                drawNode(cur.x,cur.y,cur.size,i,j,0); 
            else{
                drawNode(cur.x,cur.y,0.5,i,j,255);
                let r = length/2-length*0.25*Math.SQRT1_2;
                line(cur.x+r,cur.y+r,cur.x+length-r,cur.y+length-r);
                line(cur.x+r,cur.y+length-r,cur.x+length-r,cur.y+r);
            } 
                              
        }
    if(curPos!=undefined){
        hover(curPos.curRow,curPos.curCol);
    }
}

//draws circle representing node and edges connected it
//circle size describles the size of a circle with a number between 0 and 1
function drawNode(x,y,circleSize, curX, curY, color){
    console.log(`${curX}, ${curY}, ${circleSize}`);
    fill(color);
    let d = length*circleSize;
    let lineLength =  0.5*length*(1-circleSize);
    circle(x+length/2,y+length/2,d);
    if(curY != 0)
        line(x, y+length/2,x+lineLength,y+length/2);
    if(curY != col-1)
        line(x+d+lineLength, y+length/2,x+length,y+length/2);
    if(curX != 0)
        line(x+length/2, y,x+length/2,y+lineLength); 
    if(curX != row-1)
        line(x+length/2, y+d+lineLength,x+length/2,y+length);
}