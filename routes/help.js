/*
*
* Help 
*
*/

async function help(message) {
  console.log("help reached")
  const messageArr = message.split(" ")
  
  let response = ""
  if(messageArr.length <= 1)
    response = "Helpful Commands:\nstellar - make payments\nmaps - get directions\n\nTry helper \"command\" to get more info"

  if(messageArr[1] == "stellar"){
    response = "stellar\nmake payments\n\nExample\nstellar {Nathhan implement HERE}"
  }
  else if(messageArr[1] == "maps")
    response = `maps\n
Lost? Get Directions!
Example:
To get from Dallas To San Francisco

maps \"Dallas\" \"San Francisco\" 1

User Guide:
maps \"loc1\" \"loc2\" pageNum`

  return response;
}

module.exports = {help};
