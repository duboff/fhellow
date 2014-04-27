
/**
 * Module dependencies.
 */
var LoginCallback = 'http://192.168.50.23:3000/auth/callback/';
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var db = require('orchestrate')('f362f756-36ac-4b42-9dce-b9e581a76ce9');

var twitterAPI = require('node-twitter-api');

var twitter = new twitterAPI({
    consumerKey: 'LnxADk6p4pV1SK7QKeaskvG8R',
    consumerSecret: 'CFqngoBbRaf4T269Q19JAN1JWm5qlE1i2YVVaEvM3VSZH9xLB0',
    callback: LoginCallback
});

var app = express();
app.configure(function() {

  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.methodOverride());

  app.use(express.static(path.join(__dirname, '/public')));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'EuhcuWEgf' }));
  app.use(app.router);

});


app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

app.get('/map', function(req, res){
  res.render('map', {});
});

app.get('/auth/twitter', function(req, res){
    twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results){
    if (error) {
        res.send('Something went terribly wrong');
    } else {
    res.cookie('requestToken', requestToken, { maxAge: 900000});
    res.cookie('requestTokenSecret', requestTokenSecret, { maxAge: 900000});
    res.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + requestToken);
    res.send('you should be on twitter now..');
    }
});

  });

app.get('/auth/callback',
  function(req, res) {
  var accessTokenT = '';
  var accessTokenSecretT = '';
twitter.getAccessToken(req.query['oauth_token'], req.cookies['requestTokenSecret'], req.query['oauth_verifier'], function(error, accessToken, accessTokenSecret, results) {
    if (error) {
        console.log(error);
    } else {
    res.cookie('accessToken', accessToken, { maxAge: 900000});
    res.cookie('accessTokenSecret', accessTokenSecret, { maxAge: 900000});
    res.redirect('/map');
    }
});
}
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/api/update-location', function(req, res){
var getLat = req.query.lat;
var getLon = req.query.lon;

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
var uniq = makeid();
db.put('user_locations', uniq, {
 "lat": getLat,
 "lon": getLon,
 "uniq": uniq,
 }, false)
.then(function (res) {})
.fail(function (err) {})
res.send('ok');
});

app.get('/api/get-locations', function (req, res) {


   db.search('user_locations', '*')
   .then(function (orchestrateData) {
    console.log(orchestrateData.body);
  res.send(orchestrateData.body);
   })
   .fail(function (err) {
     res.end('err:' + err);
     console.log(err);
   })

});



http.createServer(app).listen(3000, function(){
  console.log("Express server listening on port " + app.get('port'));
});