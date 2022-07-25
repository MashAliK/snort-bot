const express = require('express');
const path = require('path');
const http = require('http');
const app = express();
const server = http.createServer(app)
const router = express.Router();
const PORT = 3000;
const { Server } = require('socket.io');
const io = new Server(server);

app.use("public",express.static(__dirname + '/public'));
app.set("views", path.join(__dirname+ "/views"));
app.set("view engine", "ejs");


app.use(express.static('views'));
app.get('/',function(req,res){
    res.render("index");
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('message', (msg, callback) =>{
        console.log("User says: "+msg);
        callback(
            { status : "ok"}
        );
    });
});

server.listen(process.env.PORT || PORT, function(){
    console.log("Server is listening on port " + PORT);
});