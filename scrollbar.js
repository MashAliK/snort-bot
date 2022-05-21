let squareSize = window.parent.scrollSize, col = window.parent.numCol;

function setup(){
    createCanvas(squareSize*col, squareSize);
}

function draw(){
    let graph = top.graph;
    if(graph == undefined) return;
    for(let j = 0; j < col; j++){
        if(graph[0][j].available == "all" ) 
            fill(0,255,0);
        else
            fill(255);
        if(j == 0)
            square(j*squareSize,0,squareSize,5,0,0,5);
        else if(j == col-1)
            square(j*squareSize,0,squareSize,0,5,5,0);
        else
        square(j*squareSize,0,squareSize);
    }
}