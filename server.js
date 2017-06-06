"use strict";
const dotenv = require('dotenv');
dotenv.load();
const http = require('http');
const https = require('https');
// const ENV             = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
// const sass            = require("node-sass-middleware");
const app = express();
const httpApp = express()


// Witty requires
const fs = require('fs.extra')
const fmp = require('./serverJS/filemaker')
  // const fileUpload      = require('express-fileupload');


// httpApp.set('port', process.env.PORT || 80);
// app.set('port', process.env.PORT || 443);
httpApp.set('port', process.env.PORT || 8080);
app.set('port', process.env.PORT || 8443);

// websocket
// const SocketServer = require('ws').Server;


app.use(bodyParser.json());
// app.use(fileUpload());
app.use(express.static(__dirname + '/dist'))
  // Home page
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/start", (req, res) => {
  res.send("Hello World");
});

app.get("/getThumbs", (req, res) => {

  fmp.RESTfmGet('getDeckThumbs', 'decks', '', (data) => res.json(data))
});

app.get("/getTheGame/:id", (req, res) => {

  fmp.RESTfmGet('getTheDeck', 'decks', req.params.id, (data) => res.json(data))
});

app.get("/getTheThumb/:id", (req, res) => {

  fmp.RESTfmGet('getTheThumb', 'decks', req.params.id, (data) => res.json(data))
});

app.get("/getTheLivePlayLatestMove/:id", (req, res) => {

  fmp.RESTfmGet('getThePlayLatestMoveNum', 'livePlayLeaderLatestMove', req.params.id, (data) => res.json(data))
});


app.post('/postLiveGameData', (req, res) => {

  fmp.RESTfmPost(req.body, 'post', 'setPlayData', 'playLive', '', '', (data) => {
    res.json(data)
  })
})

app.post('/putLiveGameData/:id', (req, res) => {

  const params = decodeURIComponent(req.params.id)
  console.log(`params: ${req.params.id}`)
  fmp.RESTfmPost(req.body, 'put', 'setPlayData', 'playLive', req.params.id, '', (data) => {
    res.json(data)
  })
})



// Port stuff

// set up a route to redirect http to https
httpApp.get('*', function(req, res) {
  res.redirect('https://wittysmarties.ca' + req.url)
})


const ssl = {
  key: fs.readFileSync('./c_store/private5_11_d.key'),
  cert: fs.readFileSync('./c_store/ServerCertificate.cer'),
  ca: fs.readFileSync('./c_store/CACertificate-INTERMEDIATE-1.cer'),
};

https.createServer(ssl, app).listen(app.get('port'), function() {
  console.log('Express HTTPS server listening on port ' + app.get('port'));
});

http.createServer(httpApp).listen(httpApp.get('port'), function() {
  console.log('Express HTTP server listening on port ' + httpApp.get('port'));
});
