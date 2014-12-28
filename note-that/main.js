
var url = "";

//adds the event listener to the printer button.
document.addEventListener('DOMContentLoaded', function () {
  url = getUrl();
  var printbutton = document.getElementById("printer");
  printbutton.addEventListener('click', printer);

  //var sendbutton = document.getElementById("send");
  //sendbutton.addEventListener('click',send);

  var savebutton = document.getElementById("save");
  savebutton.addEventListener('click',saver);

  var restorebutton = document.getElementById("restore");
  restorebutton.addEventListener('click',restoreData);

  var highlighbutton = document.getElementById("highlight");
  highlighbutton.addEventListener('click',highlight);
});

function saveData(url,divs)
{
  //chrome.storage.local.set({'YourKey': 'YourValue'});
  //chrome.storage.local.set({url: divs});
  chrome.storage.local.set({'vd':divs});
}

function retriveData(url)
{
  chrome.storage.local.get('other', function (obj) {
 //obj.YourKey contains "YourValue"
    //console.log("The url object is "+obj.virtuallydistributed.com);
    console.log("The url object is "+obj.vd);
    return obj.url;
 });
}

//Sends a message to the open tab to call the printer.
function printer(){
		
	msg("print","");
}


function highlight()
{
  msg("highlight","");
}

function send()
{
	msg("down","");
}

function saver()
{
	//var url = getUrl;
	var obj = msg("save","");
  //saveData(url,obj);
}

function restoreData()
{
    var url = getUrl();
    //var obj = retriveData(url);
    msg("restore","");
}

function getUrl()
{
  //gets the url
  var tabUrl ="";
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      console.log("This url is "+tabs[0].url);
      tabUrl = tabs[0].url;
      return tabUrl;
    });
}

function msg(query,otherInfo)
{
	

  //var tabUrl = getUrl();
  var tabUrl = "";
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      console.log("This url is "+tabs[0].url);
      tabUrl = tabs[0].url;

      console.log("In msg function the url is "+tabUrl);
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {greeting: query,url:tabUrl, other:otherInfo}, function(response) {
              return response.farewell;
              });
        });
      
    });
  
}


