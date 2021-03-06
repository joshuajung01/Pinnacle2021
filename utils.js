/*
  *
  * Util functions that aren't cool enough to be in the main files
  *
*/

const { StellarTomlResolver } = require('stellar-sdk');
const query = require('./routes/query.js')
const processStellar = require('./routes/processStellar.js')
const maps = require('./routes/map.js')
const browser = require('./routes/browser.js')
const help =  require('./routes/help.js')

function firstWord(str) {
  var words = str.trim().split(" ");
  return words[0];
}

async function router(message) {
  console.log("Router")
  //message = message.toLowerCase();

  message = message.replace(/\s+/g, ' ').trim();
  
  let cmd = firstWord(message);
  cmd = cmd.toLowerCase();
  if(message.includes("http://") || message.includes("https://")) {
        cmd = 'browser';
      }
  switch(cmd) {
    case "stellar":
      console.log("stellar")
      return await processStellar.parse(message);
    case "maps":
      console.log("maps")
      message = message.toLowerCase();
      var returnMessage = await maps.maps(message);
      return returnMessage;
    case "browser":
      console.log("browser")
      message = message.toLowerCase();
      var returnMessage = await browser.browser(message);
      return returnMessage;
    case "helper":
      console.log("helper")
      message = message.toLowerCase();
      var returnMessage = await help.help(message);
      return returnMessage;
    default:
      console.log("default")
      message = message.toLowerCase();
      var returnMessage = await query.query(message);
      return returnMessage
  }

}

module.exports = {firstWord, router};
