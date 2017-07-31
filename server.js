var express = require('express');
var app = express();

app.get('/', function(req, res){
  res.send('id: ' + req.query.id);
});

app.use(express.static('.'));

app.listen(80, '0.0.0.0', function() {
	console.log('Listening on port ' + this.address().port);
});

