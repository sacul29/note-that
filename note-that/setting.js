document.addEventListener('DOMContentLoaded', function () {
  var button = document.getElementById("button")
  button.addEventListener('click', click);
});



/*
* When clicked it sends a message to the tab containing the typed text.
*/
function click(e) {
  
  //nameButton.value = "Goodbye!"
  //nameButton.value=enteredText;
  var highColor = document.getElementsByName("highcolor");

  var boxColor = document.getElementsByName("boxcolor");

  var highlight = "";
  var box = "";
  
  length = highColor.length;
  for(var i = 0; i<length; i++)
  {
      if(highColor[i].checked)
      {
          highlight = highColor[i];
      }
  }

  length = boxColor.length;
  for(var i = 0; i<length; i++)
  {
      if(boxColor[i].checked)
      {
          box = boxColor[i];
      }
  }

  var color = { high: highlight.value, comment: box.value};
  console.log("You choose highlight color "+highlight.value+" and a comment color of "+box.value);
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  
  chrome.tabs.sendMessage(tabs[0].id, {greeting: "colors", setting:color}, function(response) {
    console.log(response.farewell);
  });
});
}