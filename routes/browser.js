/*
  *
  * Browser Rendering
  *
*/

const puppeteer = require('puppeteer');

async function browser(message) {
  let words = message.trim().split(" ");
  const browser = await puppeteer.launch({ headless: false, 'args' : [
    '--no-sandbox',
    '--disable-setuid-sandbox'
  ]});
  const page = await browser.newPage();
  //await page.setViewporpt({ width: 1920, height: 1080 })


  await page.goto(words[0], {
    waitUntil: 'networkidle0',
  });
  
  if(words.length == 1) {
      try {
    await page.evaluate(() => {
      var elements = document.querySelectorAll("[href]");
      for(var i = 0; i < elements.length; i++) {
        elements[i].innerHTML += "(" + i + ")";
      }
    });
  } catch (err) {
    console.log(err);
  }
  } else {
    console.log("Reached")
      try{
      await page.evaluate(async (words) => {
      var elements = document.querySelectorAll("[href]");
        //elements[Number(words[1])].click()
        await elements[Number(words[1])].click();                 // click middle button, link open in a new tab
      }, words)
      } catch(err){
        console.log(err);
      }
      await new Promise(r => setTimeout(r, 1000));

  }


 await page.screenshot({ path: 'images/example.png' });

  await browser.close();
  return "Current URL: " + page.url();
}

function delay(time) {
   return new Promise(function(resolve) { 
       setTimeout(resolve, time)
   });
}


module.exports = {browser};
