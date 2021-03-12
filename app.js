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
  const cookie = new Cookies(req, res);
  const optimizelyClientCookie = cookie.get('optimizelyEndUserId');
  const optimizelyServerCookie = cookie.get('optimizelyEndUserId-server');

  if (!optimizelyClientCookie || !optimizelyServerCookie) {

    const randomID = generateID();
    const cookieAttributes = {
      expires = setDate(180),
      domain = 'hmkb.com',
      sameSite = true
    };

    cookie.set('optimizelyEndUserId-server', randomID, cookieAttributes);
    cookie.set('optimizelyEndUserId', randomID,  { ...cookieAttributes, httpOnly: false });
  }
  res.render('index.ejs');
});


function generateID() {
  const timestamp = new Date().getTime();
  const randomNum = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
  return `oeu${timestamp}-${randomNum}.lov`;
}

function setDate(days = 180) {
  let targetDate = new Date().getTime() + (days * 24 * 60 * 60 * 1000);
  targetDate = new Date().setTime(targetDate);
  return new Date(targetDate);
}
