// Modules
var express = require('express');
var Cookies = require('cookies');

// Globals
var port = process.env.PORT || 3000;

// Initiate Express
var app = express();
app.set('view engine', 'ejs');

app.listen(port, function (req, res) {
  console.log('App listening on port 3000');
});

// Routes
app.get('/', function (req, res) {
  const cookie = new Cookies(req, res);
  const optimizelyClientCookie = cookie.get('optimizelyEndUserId');
  const optimizelyServerCookie = cookie.get('optimizelyEndUserId-server');

  const cookieAttributes = {
    expires: setDate(180),
    domain: 'hmkb.com',
    sameSite: true,
  };

  // First time visitors - no server cookie
  if (!optimizelyServerCookie) {
    console.log('condition: 1');
    const randomID = generateID();
    cookie.set('optimizelyEndUserId-server', randomID, cookieAttributes);
    cookie.set('optimizelyEndUserId', randomID, {
      ...cookieAttributes,
      httpOnly: false,
    });
  }
  // Expired ITP visitors - no client cookie but has server cookie
  else if (!optimizelyClientCookie && optimizelyServerCookie) {
    console.log('condition: 2');
    cookie.set(
      'optimizelyEndUserId-server',
      optimizelyServerCookie,
      cookieAttributes
    );
    cookie.set('optimizelyEndUserId', optimizelyServerCookie, {
      ...cookieAttributes,
      httpOnly: false,
    });
  } else {
    console.log('condition: 3');
    // Returning users - refresh existing client and server cookie expirations
    cookie.set(
      'optimizelyEndUserId-server',
      optimizelyServerCookie,
      cookieAttributes
    );
    cookie.set('optimizelyEndUserId', optimizelyServerCookie, {
      ...cookieAttributes,
      httpOnly: false,
    });
  }

  res.render('index.ejs');
});

// Redirect to recipe-saver-personal site as a shortcut link
app.get('/r', function (req, res) {
  res.redirect('https://recipe-saver-personal.herokuapp.com/recipes/all');
});

app.get('/kitty-kush', function (req, res) {
  res.redirect('https://kittykush.co?sample=true');
});

function generateID() {
  const timestamp = new Date().getTime();
  const randomNum = String(Math.floor(Math.random() * 1000000)).padStart(
    6,
    '0'
  );
  return `oeu${timestamp}-${randomNum}.lov`;
}

function setDate(days = 180) {
  let targetDate = new Date().getTime() + days * 24 * 60 * 60 * 1000;
  targetDate = new Date().setTime(targetDate);
  return new Date(targetDate);
}
