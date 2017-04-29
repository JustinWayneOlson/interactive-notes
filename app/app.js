var express = require('express');
var app = express();
var request = require('request');

app.get('/', function(req, res){
   res.sendFile('./public/html/index.html', {root: __dirname});
});

app.listen(3000, function(){
   console.log('Server started listening on port 3000');
});

