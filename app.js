// Modules
var express = require('express');
var Cookies = require('cookies');

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
  var cookie = new Cookies(req, res);
  var optimizelyCookie = cookie.get('optimizelyEndUserId');
  console.log('optimizelyCookie', optimizelyCookie);
  if (!optimizelyCookie) {
    cookie.set('optimizelyEndUserId', generateID(), { expires: setDate(180), domain: 'hmkb.com' });
  }
  res.render('index.ejs');
});


function generateID() {
  var timestamp = new Date().getTime();
  var randomNum = String(Math.floor(Math.random() * 10000000000000000)).padStart(6, '0');
  return `${timestamp}-${randomNum}`;
}

function setDate(days = 180) {
  var targetDate = new Date().getTime() + (days * 24 * 60 * 60 * 1000);
  targetDate = new Date().setTime(targetDate);
  return new Date(targetDate);
}
