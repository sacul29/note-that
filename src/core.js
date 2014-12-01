
restoreColors();

document.addEventListener('mousedown', function (e) {
}, false);

var flag = false;
var hflag = false;
var comText = "";
var commentNum = 0;
var app_ids = 1;
var savedDivs = [];
//var pageData = {};
var boxColor = "#fcc";
var highColor = "yellow";
//mousemove

// Mouse listener for any move event on the current document.
document.addEventListener('mouseup', function (e) {
  if(flag)
  {
    commentText(comText);
  }
  if(hflag)
  {
    highlight();
  }
}, false);



function replaceText(selectedText,selectedNode,range)
{
  //console.log(selectedText);

  var currentText = range.cloneContents();  
  //get rid of current contents.
  range.deleteContents();
  //add the subscript tag
  var sup = document.createElement("sup");
  sup.style.color = "red";
  //add the number to be subscripted
  var newText = document.createTextNode("("+commentNum+")");
  
  //creates an element to change the text color.
  var colored = document.createElement("font");
  colored.style.color = "red";

  //create a text node for the old text
  //var oldText = document.createTextNode(selectedText);
  colored.appendChild(currentText);
  //oldText.color = "red";

  //add the comment number to the subscript tag
  sup.appendChild(newText);

  //tag the content as a comment--to be used to prevent recommenting
  var comment = document.createElement("commented");

  comment.appendChild(colored);
  comment.appendChild(sup);

  range.insertNode(comment);
}


//Used to send function calls from the extension
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    //if (request.greeting == "hello"){
      sendResponse({farewell: "goodbye"});
      if(request.greeting === "print")
      {
        console.log("Now printing");
        printer();
        sendResponse({farewell: "goodbye"});
        return;
      }
      else if(request.greeting === "down")
      {
        //console.log(request);
        
        sendResponse({farewell: "goodbye"});
        return;
      }
      else if(request.greeting === "save")
      {
        
        //sendResponse({farewell: savePage(request.url)});
        var url = unique(request.url);
        savePage(url);
        sendResponse({farewell:"goodbye"});
        return;
      }
      else if (request.greeting === "restore")
      {
        //console.log("Otherinfo is"+request.other);
        var url = unique(request.url);
        restoreData(url);
        sendResponse({farewell:"goodbye"});
        return;
      }
      else if(request.greeting === "highlight")
      {
        hflag = true;
        sendResponse({farewell:"goodbye"});
        return;
        //highlight();
      }
      else if(request.greeting === "colors")
      {
        setColor(request.setting.high, request.setting.comment);
        sendResponse({farewell:"goodbye"});
        return;
      }
      console.log(request.greeting);
      flag = true;
      comText = request.greeting;
    //}
  });

function restoreColors()
{
  chrome.storage.local.get("boxcolor", function (data) { 

    if(!data["boxcolor"])
    {
      console.log("No saved box preferences.")
    }
    console.log("box color is currently "+data['boxcolor']);
    boxColor = data["boxcolor"];
    
    
    
  });


  chrome.storage.local.get("highcolor", function (data) { 
   if(!data["highcolor"])
   {
    console.log("No saved highlight preferences.");
    return;
  }
  console.log("High color is currently "+data['highcolor']);
  highColor = data["highcolor"];

});

  console.log("Current colors are b="+boxColor+" h="+highColor);
}


function setColor(hColor, bColor)
{
    switch(hColor){
      case "yellow" : highColor = "yellow"; break;
      case "blue" : highColor = "#98d5ff"; break;
      case "green" : highColor = "#2ecc71"; break;
    }

    switch(bColor){
      case "grey" : boxColor = "rgba(237,238,238,0.8)"; break;
      case "clear" : boxColor = "rgba(255,0,0,0.008)"; break;
      case "red" : boxColor = "#fcc"; break;
    }



    var obj = {};
    obj["boxcolor"] = boxColor;
    obj["highcolor"] = highColor;
    chrome.storage.local.set(obj);
}


function createTitle()
{
  var commentTitle = document.createElement('div');
  //var h1 = document.createElement('H1');
  //var title = document.createTextNode("Comments:");
  //h1.appendChild(title);
  commentTitle.innerHTML = "Comments:";
  commentTitle.style.fontSize="50px";
  commentTitle.style.float="center";
  //commentTitle.appendChild(title);
  return commentTitle;
}

function printer()
{
    window.print();
}

function getFullDate()
{
  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();
  var h = date.getHours();
  var min = date.getMinutes();
  var noon = "AM";
  if(h > 12)
  {
    h = h-12;
    noon = "PM";
  } 
  if(min<10)
  {
    min = "0"+min;
  }
  var timeString = "("+m+"/"+d+"/"+y+" "+h+":"+min+noon+")";
  //console.log("Timestring is "+timeString);
  return timeString;
}


//Function to highlight selected text
function highlight()
{
    var temp = window.getSelection();
    //var tempNode = window.getSelection().extentNode.parentNode;

    //var selected = window.getSelection().toString();
    range = temp.getRangeAt(0);
    if(range.collapsed)
    {
      console.log("Range is collapsed.");
      return;
    }
    var tempNode = range.cloneContents();
    //console.log("temp is "+tempNode);

    range.deleteContents();
  
  //creates an element to change the text color.
  var colored = document.createElement("font");
  //colored.style.backgroundColor = "yellow";
  colored.style.backgroundColor = highColor;

  //create a text node for the old text
  //var oldText = document.createTextNode(selected);
  //var oldText = document.createTextNode(temp);

  colored.appendChild(tempNode);
  //oldText.style.backgroundColor = "red";
  //adds the old text to the page.
  range.insertNode(colored);
  hflag = false;
}

function commentText(commentText)
{
  var temp = window.getSelection();
  var selected = window.getSelection().toString();
  //locateText(selected);
  range = temp.getRangeAt(0);
  if(range.collapsed)
  {
    console.log("Range is collapsed.");
    return;
  }
  var rangeCopy = range.cloneContents();
  var mydiv = document.createElement('div'); 

  //I am using this function to get a greater consistent context.
  //If I used the selection to append the comment, then it would be.
  var superNode = getSuperNode();
  superNode.appendChild(mydiv);

  //console.log(superNode.innerHTML);

  //Check if they're trying to comment already commented text
  /*console.log(superNode.getElementsByTagName("sup").length);
  if(superNode.getElementsByTagName("sup").length > 0) {
    return;
  }
*//*
  if(superNode.innerHTML.indexOf("sup")!=-1)
  {
    console.log("Break out");
    return;
  }*/
  /*
  if(range.commonAncestorContainer.tagName == "SUP")
  {
    console.log("I broke");
    return;
  }
  if(range.commonAncestorContainer.nodeName === "SUP" ||
    range.commonAncestorContainer.nodeName === "sup") {
    console.log("Breaking free");
    return;
  }
  console.log(range);
  /*if(rangeCopy.
  {
    console.log("Breaking free");
    return;
  }*/
  // Scopey iisues
 /* if (superNode.getElementsByTagName("commented").length > 0) {
    return;
  }*/

  commentNum = commentNum + 1;
  
  replaceText(selected,temp,range);

  var ts = getFullDate();
  //this sets the text for the comments.
  mydiv.innerText=commentNum+". "+ts+" "+commentText;
  mydiv.id = commentNum+"note";
  mydiv.style.fontSize="15px";
  mydiv.style.color="black";
  //mydiv.style.height="24px";
  mydiv.style.lineHeight="24px";


  mydiv.style.position = "static";
  mydiv.style.left = superNode.offsetLeft + "px";
  mydiv.style.top = superNode.offsetTop + superNode.offsetHeight + "px";
  //mydiv.style.width = "700px";
  //mydiv.style.display = "block";
  //mydiv.style.float = "right";
  //mydiv.style.cssFloat = "right";
  mydiv.style.padding = "0px 8px";
  mydiv.style.margin = "4px 0px";
  mydiv.style.border = "2px solid #d00";
  mydiv.style.background = boxColor;
  //Code to store data for saving later
  var offset = document.getElementById(commentNum+"note").getBoundingClientRect();
  
  flag = false;
}


function restoreData(url)
{
  console.log("in restoreData url is "+url);
  chrome.storage.local.get(url, function (data) { 
    if(!data[url])
    {
      console.log("No saved data!");
      return;
    }
    document.documentElement.innerHTML = data[url].webpage;

    alert("Comments Restored");

  });
}

//remove all non alpha character
function unique(urlstring)
{
  //console.log("Before the url is "+urlstring);
  var temp = urlstring.replace(/[^a-zA-Z0-9]/g, "");
  console.log("After the url is "+temp);
  return temp;
}


function savePage(tabUrl)
{
  console.log("inside of savePage "+tabUrl);
  var pageData ={};
  // Save the content of the webpage
  pageData.webpage = document.documentElement.innerHTML;
  pageData.url = unique(tabUrl);
  
  console.log("before save url is "+tabUrl);
  var obj = {};
  obj[tabUrl] = pageData;
  chrome.storage.local.set(obj);
  alert("Comments saved");
  return pageData;
}




document.addEventListener('DOMContentLoaded', function () {
  console.log("Dom content loaded.");
  
});

// Gets the selected text's node, its parent's, or its ancestor's.
function getSuperNode()
{
  var node,selection;
  if (window.getSelection) {
    selection = getSelection();
    node = selection.anchorNode;
  }
  if (!node && document.selection) {
      selection = document.selection
      var range = selection.getRangeAt ? selection.getRangeAt(0) : selection.createRange();
      node = range.commonAncestorContainer ? range.commonAncestorContainer :
             range.parentElement ? range.parentElement() : range.item(0);
  }
  if (node) {
    return node.parentNode;
  }
};

