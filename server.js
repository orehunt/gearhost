var express = require('express');
var app = express();
var port = process.env.PORT || '3000';

app.get('/', function(req, res){
  res.send('id: ' + req.query.id);
});

app.use(express.static('.'));

app.listen(port, function() {
	console.log('Listening on port ' + this.address().port);
});
