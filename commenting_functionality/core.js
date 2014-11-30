var bubbleDOM = document.createElement('div');
bubbleDOM.setAttribute('class', 'selection_bubble');
document.body.appendChild(bubbleDOM);




document.addEventListener('mousedown', function (e) {
  bubbleDOM.style.visibility = 'hidden';
}, false);

var flag = false;
var comText = "";
var commentNum = 0;
var app_ids = 1;
//mousemove

// Mouse listener for any move event on the current document.
document.addEventListener('mouseup', function (e) {
  if(flag)
  {
    commentText(comText);
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
        return;
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

function commentText(commentText)
{
    var temp = window.getSelection();
    var selected = window.getSelection().toString();
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
    mydiv.style.fontSize="15px";
    selectionNode = window.getSelection().extentNode.parentNode;
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
    flag = false;
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
