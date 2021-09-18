/*
  *
  * Main file, takes text input and routes to different functions
  *
*/

require('dotenv').config();
const utils = require('./utils.js')

const express = require('express');
const http = require('http');
const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/', (req, res) => {
  const twiml = new MessagingResponse();
  const message = req.body.Body;
  const response = utils.router(message);
  console.log(response);

  client.messages
      .create({body: response, from: '4254413838', to: '6143643805'})
});

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});






