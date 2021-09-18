const {Client} = require("@googlemaps/google-maps-services-js");
const client = new Client({});

//maps chicago houston pageNum
//maps "123 address" "4325235 address" pageNum

async function maps(message) {
  var messageArr = message.split(" ");
  var finalDirectionsArr = [];
  var pageNum = messageArr[messageArr.length - 1]

  var res = await client.directions({
    params: {
      origin: messageArr[1],
      destination: messageArr[2],
      key: process.env.GOOGLE_MAP
    }
  })

  var writtenDirections = res.data.routes[0].legs[0].steps;

  finalDirections = "";

  writtenDirections.forEach(function(item, index, array) {
    var strippedHtml = item.html_instructions.replace(/<[^>]+>/g, '');
    strippedHtml = "".concat(index + 1).concat(". ").concat(strippedHtml).concat("\n\n")
    finalDirectionsArr.push(strippedHtml)
  })


  return arrToText(finalDirectionsArr, pageNum)
}

function arrToText(arr, pageNum){
  const directions = arr.slice((pageNum-1)*5, (pageNum-1)*5 + 5)
  var page = ""

  directions.forEach(function(item, index, array) {
    page = page.concat(item)
  })

  if(pageNum > Math.floor(arr.length/5) || pageNum < 1){
    return "Invalid Page Number " + pageNum + "/" + Math.floor(arr.length/5)
  }
  page = page.concat("\n").concat("Page: ").concat(pageNum).concat("/").concat(Math.floor(arr.length/5))

  return page
}
module.exports = {maps};
