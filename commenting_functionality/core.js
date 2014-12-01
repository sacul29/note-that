var bubbleDOM = document.createElement('div');
bubbleDOM.setAttribute('class', 'selection_bubble');
document.body.appendChild(bubbleDOM);




document.addEventListener('mousedown', function (e) {
  bubbleDOM.style.visibility = 'hidden';
}, false);

var flag = false;
var hflag = false;
var comText = "";
var commentNum = 0;
var app_ids = 1;
var savedDivs = [];
var pageData = {};
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
  console.log(selectedText);
  //get rid of current contents.
  range.deleteContents();
  //add the subscript tag
  var sup = document.createElement("sup");
  //add the number to be subscripted
  var newText = document.createTextNode(commentNum);
  
  //creates an element to change the text color.
  var colored = document.createElement("font");
  colored.style.color = "red";

  //create a text node for the old text
  var oldText = document.createTextNode(selectedText);
  colored.appendChild(oldText);
  oldText.color = "red";

  //add the comment number to the subscript tag
  sup.appendChild(newText);

  //adds the subscript tag to the page, so it appears at end of line
  range.insertNode(sup);

  //adds the old text to the page.
  range.insertNode(colored);



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
        return;
      }
      else if(request.greeting === "highlight")
      {
        hflag = true;
        return;
        //highlight();
      }
      console.log(request.greeting);
      flag = true;
      comText = request.greeting;
    //}
  });

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
  var timeString = "("+m+"/"+d+"/"+y+" "+h+":"+min+noon+")";
  //console.log("Timestring is "+timeString);
  return timeString;
}


//Function to highlight selected text
function highlight()
{
    var temp = window.getSelection();
    var selected = window.getSelection().toString();
    range = temp.getRangeAt(0);
    if(range.collapsed)
    {
      console.log("Range is collapsed.");
      return;
    }

    range.deleteContents();
  
  //creates an element to change the text color.
  var colored = document.createElement("font");
  colored.style.backgroundColor = "yellow";

  //create a text node for the old text
  var oldText = document.createTextNode(selected);
  colored.appendChild(oldText);
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

    commentNum = commentNum + 1;
    
    replaceText(selected,temp,range);
    var mydiv = document.createElement('div'); 
    var ts = getFullDate();
    //this sets the text for the comments.
    mydiv.innerText=commentNum+". "+ts+" "+commentText;
    mydiv.id = commentNum+"note";
    //added for fixing nested highlights
    //mydiv.className = 'notethat-noted';
    mydiv.style.fontSize="15px";
    selectionNode = window.getSelection().extentNode.parentNode;
    /* Try to append to end of "paragraphs" instead of highlights
    and comments
    */
    /*console.log("Class is "+temp.className);
    if (temp.className === 'notethat-noted') {
      selectionNode = selectionNode.parentNode;
    }*/
    
    /*if(commentNum===1)
    {
      titleDiv = createTitle();
      selectionNode.offsetParent.appendChild(titleDiv);

    }*/
    
    //selectionNode.offsetParent.appendChild(mydiv);

    selectionNode.appendChild(mydiv);


    mydiv.style.position = "static";
    mydiv.style.left = selectionNode.offsetLeft + "px";
    mydiv.style.top = selectionNode.offsetTop + selectionNode.offsetHeight + "px";
    //mydiv.style.width = "700px";
    //mydiv.style.display = "block";
    //mydiv.style.float = "right";
    //mydiv.style.cssFloat = "right";
    mydiv.style.border = "4px solid #d00";
    mydiv.style.background = "#fcc";


    //Code to store data for saving later
    var offset = document.getElementById(commentNum+"note").getBoundingClientRect();
    /*var l = offset.left;
    var t = offset.top;
    var text = mydiv.innerText;
    var tempid = commentNum;
    var refText = selected;
    */
    

    console.log("Top is "+offset.top+" left is "+offset.left);
    flag = false;
}


function restoreData(url)
{
  console.log("in restoreData url is "+url);
  chrome.storage.sync.get(url, function (data) { 
    if(!data[url])
    {
      console.log("No saved data!");
      return;
    }
    console.log("data is " +data[url].divs[0].comment);
    console.log(data);
    //var pageData = data;

    //console.log(pageData);
    console.log("Now debugging object");
    for(var key in data.divs)
    {
      var obj = data[key];
      for(var prop in obj)
      {
        if(obj.hasOwnProperty(prop)){
          console.log(prop+" = "+obj[prop]);
        }
      }
    }

    /*var mydiv = document.createElement('div');
    mydiv.innerText = pageData[0].comment;
    mydiv.id = pageData[0].id+"note";
    mydiv.style.fontsize = "15px";
    mydiv.style.position = "static";
    mydiv.style.left = pageData[0].left;
    mydiv.style.top = pageData[0].top;
    mydiv.style.background = "#fcc";*/
    //pageData[0].parent.appendChild(mydiv);

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


function record()
{

}

//Need to fix this function.
function savePage(tabUrl)
{
  console.log("inside of savePage "+tabUrl);
    
    for (var i = 1; i <= commentNum; i++) {
      var div = document.getElementById(i+"note");
      var offset = div.getBoundingClientRect();
      var l = offset.left;
      var t = offset.top;
      var text = div.innerText;
      var tempid = i;
      var parentNode = div.offsetParent.id;
      savedDivs[savedDivs.length] = {left:l,top:t,comment:text, id : tempid, parent:parentNode };

      //console.log(tempObject); 
    }
    pageData.divs = savedDivs;
    pageData.url = unique(tabUrl); 
    
    console.log("before save url is "+tabUrl);
    var obj = {};
    obj[tabUrl] = pageData;
    chrome.storage.sync.set(obj, function () {
        console.log("Just stored ",pageData);
    });


    /*for (var i = 0; i<=savedDivs.length-1; i++)
    {
        console.log(savedDivs[i]);
    }*/
    //console.log(pageData);
    return pageData;
}

document.addEventListener('DOMContentLoaded', function () {
  var button = document.getElementById("button")
  console.log("Button Was Clicked");
  button.addEventListener('click', click);
});

// Move that bubble to the appropriate location.
function renderBubble(mouseX, mouseY, selection) {
  bubbleDOM.innerHTML = selection;
  bubbleDOM.style.top = mouseY + 'px';
  bubbleDOM.style.left = mouseX + 'px';
  bubbleDOM.style.visibility = 'visible';
}


function locateText(str)
{
  var flag = true;
  position = 0;

  /*while(flag === true)
  {
    if(position === -1)
    {
      flag=false;
    }
    var position = document.documentElement.innerHTML.indexOf(str,position);
    console.log("The position is "+position);
  }*/
  
}



