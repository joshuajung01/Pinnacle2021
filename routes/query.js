/*
 *
 * Wolfram Alpha API call
 *
*/
require('dotenv').config();

const WolframAlphaAPI = require('wolfram-alpha-api');
const waApi = WolframAlphaAPI(process.env.WOLFRAM_ALPHA_ID);

async function query(message) {
  var response = await waApi.getShort(message);
  return response;
}

module.exports = {query};
