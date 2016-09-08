'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
var https = require('https');
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'com.pradeep.fb.chat.bot') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

const token = "EAAEaCGohghMBACSCjBHIISby3SCnsCRY40g9rTgrRmcSZBKCguIvFe8eBqSP9kKpcCsKLQ2MK98bbJHIuLsiuBnd6A4uGCgBlPXXp1U30mkDQj4lhWr3pQrnwPnTk6z1p8CftYazMu0b0d6HcQBh28JgEvfBACPIifLuTefdcYVEF0oHh"
app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
            let text = event.message.text
            getSearchResult(sender, text);
        }
    }
    res.sendStatus(200)
})

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function getSearchResult(sender, text){

var options = {
    host: 'services.att.com',
    path: '/kmservices/v2/search?app-id=test&q=wireless',
    method: 'GET',
    headers: {'Accept': 'application/json'}
  };

  var req = https.request(options, function(res) {
    res.setEncoding('utf-8');

    var responseString = '';

    res.on('data', function(data) {
      responseString += data;
    });

    res.on('end', function() {
      var responseObject = JSON.parse(responseString);
      console.log("result: "+responseObject.message+" "+responseObject.resultBody.searchResults[0].title);
      //console.log(responseString);
      sendTextMessage(sender, responseObject.resultBody.searchResults[0].title);
    });
  });

  req.end();
}
