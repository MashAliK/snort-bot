let borderSize = 2; 
let radiusFactor = 0.5; //size of circle described with a number between 0 and 1
let tile = false;

function setup(){
    createCanvas(length*col,length*row);
    createGraph();
}

function draw(){
    stroke(0);
    let color = getColor(); 
    strokeWeight(borderSize);
    let curPos = getHover();
    for(let i = 0; i < row; i++)
        for(let j = 0; j < col; j++){
            cur = graph[i][j]
            hovered = (curPos!= undefined && curPos.curRow == i && curPos.curCol == j) ? true : false;
            if(!hovered && cur.filled==false)
                unhover(i,j);
            fill(cur.color[0],cur.color[1],cur.color[2]);
            if(tile){
                rect(cur.x,cur.y,length);
            }else {
                let circleDiameter = length*radiusFactor, lineLength = 0.5*length*(1-radiusFactor);
                circle(cur.x+length/2,cur.y+length/2,circleDiameter);
                console.log(lineLength);
                //connect lines between nodes
                if(j != 0)
                    line(cur.x, cur.y+length/2,cur.x+lineLength,cur.y+length/2);
                if(j != col-1)
                    line(cur.x+circleDiameter+lineLength, cur.y+length/2,cur.x+length,cur.y+length/2);
                if(i != 0)
                    line(cur.x+length/2, cur.y,cur.x+length/2,cur.y+lineLength); 
                if(i != row-1)
                    line(cur.x+length/2, cur.y+circleDiameter+lineLength,cur.x+length/2,cur.y+length);                  
            }
        }
    if(curPos!=undefined){
        hover(curPos.curRow,curPos.curCol,color);
    }
}
