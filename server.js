//var express = require('express');
//var app = express();
//var port = process.env.PORT || '3000';
// app.use(express.static('.'));
////app.get('/', function(req, res){
//  
//  res.send('id: ' + req.query.id);
//});
//app.listen(port, function() {
//	console.log('Listening on port ' + this.address().port);
//});

var http = require('http');
var port = process.env.PORT || '3000';

http.createServer(function (req, res) {
        //res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Hello World\n');
}).listen(port);
