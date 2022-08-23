const express = require('express');
const path = require('path');
const http = require('http');
const app = express();
const server = http.createServer(app)
const PORT = 3000;
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const { optimalMove } = require('./snortbot');
const io = new Server(server);

app.set("views", path.join(__dirname+ "/views/pages"));
app.set("view engine", "ejs");
app.use(express.static('views'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/',function(req,res){
    res.render("index");
});

app.post('/',(req,res)=>{  
    const formData = req.body;
    const isChecked = i => {return i != undefined;}
    res.render("game",{size:formData.sizeInput,botOne:isChecked(formData.botOne),botTwo:isChecked(formData.botTwo)});
});

io.on('connection', (socket) => {
    socket.on('optimalMove', (arg,callback) =>{
        callback(
            {move: optimalMove(arg[0],arg[1],arg[2],arg[3])}
        );
    });
});

server.listen(process.env.PORT || PORT, function(){
    console.log("Server is listening on port " + PORT);
});