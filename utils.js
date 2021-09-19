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
  //message = message.toLowerCase();
  let cmd = firstWord(message);
  
  if(message.includes("http://") || message.includes("https://")) {
    cmd = 'browser';
  }

  switch(cmd) {
    case "stellar":
      return await processStellar.parse(message);
    case "maps":
      var returnMessage = await maps.maps(message);
      return returnMessage;
    case "browser":
      var returnMessage = await browser.browser(message);
    case "helper":
      var returnMessage = await help.help(message);
      return returnMessage;
    default:
      var returnMessage = await query.query(message);
      return returnMessage
  }

}

module.exports = {firstWord, router};
