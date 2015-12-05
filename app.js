var express = require('express');

// Globals
var port = process.env.PORT || 3000;


// Initiate Express
var app = express();
app.set('view engine', 'ejs');

app.listen(port, function(req, res) {
	console.log('App listening on port 3000');
});


// Routes
app.get('/', function(req, res) {
	res.render('index.ejs');
});
