
//adds the event listener to the printer button.
document.addEventListener('DOMContentLoaded', function () {
  var button = document.getElementById("printer")
  button.addEventListener('click', printer);
});


//Sends a message to the open tab to call the printer.
function printer(){
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  				chrome.tabs.sendMessage(tabs[0].id, {greeting: "print"}, function(response) {
    					console.log(response.farewell);
  						});
  			});
		
	}