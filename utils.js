/*
  *
  * Util functions that aren't cool enough to be in the main files
  *
*/

const { StellarTomlResolver } = require('stellar-sdk');
const query = require('./routes/query.js')
const processStellar = require('./routes/processStellar.js')

function firstWord(str) {
  var words = str.trim().split(" ");
  return words[0];
}

async function router(message) {
  //message = message.toLowerCase();
  let cmd = firstWord(message);

  switch(cmd) {
    case "stellar":
      return await processStellar.parse(message);
    case "maps":
      return "M";
    default:
      return query.query(message);
  }

}


module.exports = {firstWord, router};
