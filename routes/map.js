const {Client} = require("@googlemaps/google-maps-services-js");
const client = new Client({});

/*
Acceptable Formats:
maps loc1 loc2 pageNum
maps "address1" "address2" pageNum
maps "loc1" "address2" pageNum
*/
async function maps(message) {
  var messageArr

  //Check for format
  if(message.includes("\"")){
    messageArr = []

    let indicies = []
    indicies.push(-1)

    //Find Index of " to split by
    for(let i = 0; i < message.length; i ++){
      if(message[i]==="\""){
        indicies.push(i);
      }
    }

    indicies.push(message.length);

    for(let i = 0; i < indicies.length - 1; i++){
      let partAddress = message.slice(indicies[i] + 1, indicies[i+1])
      if(partAddress.length >= 2){
        messageArr.push(partAddress)
      }
    }
  }
  else{
    messageArr = message.split(" ");
  }

  var finalDirectionsArr = [];
  var pageNum = messageArr[messageArr.length - 1]

  if(! Number.isInteger(pageNum) && isNaN(pageNum.slice(1)))
    pageNum = 1
  else
    pageNum = parseInt(pageNum)

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
