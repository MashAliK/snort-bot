const express = require('express');
let fs = require('fs');
const path = require('path');
const app = express();
const router = express.Router();

router.get('/',function(req,res){
    res.sendFile(__dirname + '/public/index.html');
});


app.use(express.static('public'));
app.listen(process.env.PORT || 3000);