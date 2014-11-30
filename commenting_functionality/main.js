
//adds the event listener to the printer button.
document.addEventListener('DOMContentLoaded', function () {
  var printbutton = document.getElementById("printer");
  printbutton.addEventListener('click', printer);

  var sendbutton = document.getElementById("send");
  sendbutton.addEventListener('click',send);
});


//Sends a message to the open tab to call the printer.
function printer(){
		
		msg("print");
	}


function send()
{
	msg("down");
}



function msg(query)
{
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  				chrome.tabs.sendMessage(tabs[0].id, {greeting: query}, function(response) {
    					console.log(response.farewell);
  						});
  			});
}



chrome.extension.onMessage.addListener(
  function(message,sender,sendResponse){
    if(message.type == 'getTabId')
    {
      console.log("Tab id is "+sender.tab.id);
      sendResponse({tabId:sender.tab.id});
    }
  });