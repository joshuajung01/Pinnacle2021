/*
  *
  * Main file, takes text input and routes to different functions
  *
*/

require('dotenv').config();

//imports
const utils = require('./utils.js')
const express = require('express');
const http = require('http');
const twilio = require('twilio');

const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const app = express();

const ngrok = "http://a044-97-105-8-131.ngrok.io"

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/', async (req, res) => {
   
  const twiml = new MessagingResponse();

  const message = req.body.Body;
  const senderPhoneNum = req.body.From
  const twilioPhoneNum = req.body.To
  var response = ""

 //client.messages
    //.create({body: "AAAAA", mediaUrl: ['https://tangerine-deer-7639.twil.io/assets/example.png'], from: twilioPhoneNum, to: senderPhoneNum})

  try {
    response = await utils.router(message);
    console.log(response)
  } catch(err) {
    response = "Unable to handle query! Type 'help' for help";
  }

  if(response.includes("http")) {
    console.log("pupeteer")
    client.messages.create({body: response, mediaUrl: [ngrok + '/images/example.png'], from: twilioPhoneNum, to: senderPhoneNum})
  } else {
    console.log("SENDING MESSAGE")
    client.messages.create({body: response, from: twilioPhoneNum, to: senderPhoneNum})
  }


});

app.use('/images', express.static(__dirname + '/images'));

app.listen(process.env.PORT || 3000, () => {
  console.log('Express server listening on port 3000');
});






