let squareSize = window.parent.scrollSize, col = window.parent.numCol;

function setup(){
    createCanvas(squareSize*col, squareSize);
}

function draw(){
    clear();
    let graph = top.graph;
    if(graph == undefined) return;
    for(let j = 0; j < col; j++){
        (getHover() === j) ? stroke(0,0,255) : stroke(0);
        if(graph[0][j].available == "all"){
            fill(0); circle((j+0.5)*squareSize,0.5*squareSize,0.2*squareSize);
        }else if((graph[0][j].available == "p1" || graph[0][j].available == "p2") && !graph[0][j].filled){
            (graph[0][j].available == "p1") ? fill(255) : fill(0);
            circle((j+0.5)*squareSize,0.5*squareSize,0.6*squareSize);
        } else if(getHover() === j){ fill(255,255,255,1); square(j*squareSize,0,squareSize);}
    }
}

function getHover(){ 
    let x = mouseX;
    if(x >= squareSize*col ||  x<0 ) return undefined;
    return Math.floor(x/squareSize);
}

function mouseClicked(){
    let clicked = getHover();
    if(clicked == undefined) return;
    top.scrollGame(clicked);
}