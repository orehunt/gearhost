var express = require('express');
var app = express();
var port = process.env.PORT || '3000';
app.use(express.static('.'));
app.get('/', function(req, res){
	res.send('id: ' + req.query.id);
});
app.listen(port, function() {
	console.log('Listening on port ' + this.address().port);
});
