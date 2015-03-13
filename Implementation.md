## **Implementation** ##

### _Main Extension Pop Up:_ ###
Once the extension icon is clicked, a pop up is created using main.html and core.css. Main.js creates an event listener that is activated when the extension icon is clicked and it creates buttons for each function that will activate corresponding functions when the button is pressed. This takes the URL from the current page, saves it, and allows queries to go through by grabbing data from the content window. When each button is clicked they send a message to the content script using the chrome.tabs.sendMessage api call. The content script core.js then receives the call and calls various functions depending on the action desired. For example, If highlight is clicked, the highlight flag is set to true and then the highlight function is called. Core.js distinguishes between which button was clicked based on the greeting received by the onMessage event listener.  The extension window runs in a background script.

### _Commenting:_ ###
Using a content script, comments are injected into the current page as a div.

_popup.html:_ Contains the contents of the comment box that pops up when the comment icon is clicked. This contains a text area for the comment to be inputed and a button to be pushed when the comment has been written.

_popup.js:_ Checks that the comment icon has been clicked.

_core.js:_ We use the function getFullDate to generate a time stamp for the comment boxes. The function commentText function gets the currently selected text. It then calls the replaceText function to replaces the selected text with a new version that is colored red and has the comment number appended as a superscript. We then create a new div where we place the comment number and timestamp appended with the comment text from the user. We then format the div using various css styles to make it look like a box. The div is then appended to the outer node of the selected text(aka the end of the section).

### _Printing:_ ###
We used a simple printing function that outputs the current page to a printable pdf.

### _Highlighting:_ ###
This was done by using CSS to set the background color of the text to that of the set highlighter in settings.  The highlight function grabs the current selection and then removes it from the page. It then formats text to have the background color of the highlighted color. We then reinserted the new node into the page at the same point so it looks like it has just been highlighted.
### _Saving:_ ###
The content on the page is saved within local chrome storage, to be used later in restoring. We first take the url of the webpage and run it through a special function that removes the special characters from it so we are left with just an alphanumeric string. We use this as our unique key to retrieve data from each page. Using this key we set the current html DOM content in storage to be retrieved at a later time. This is all accomplished using the savePage function.

### _Restoring:_ ###
This will restore a copy of the webpage with the saved annotations if one exists. If stored copy doesn't exist then nothing will happen. The restoreData function again uses the alphanumeric url to retrieve the stored html text. We then replace the current html content of the page with this older version that has the preserved comments and highlights.

### _Setting:_ ###
This allows the user to change the color of the highlighting and color of the comment box.

_settings.html:_ Using radio buttons that have the same name but different values, we were able to make it so that only one of the colors could be selected at once for the highlighting and for the comment box.

_settings.js:_ We used event listeners to call the function when the function icon was clicked within the extension pop up. This function sets the color of the highlighting and comment boxes and returns what you've selected to verify that you've selected the correct colors. Setting the color depends on the setColor function in core.js.

_core.js:_ In setColor, we parse out the colors we selected and then set them equal to global values that are used when highlighting and commenting. To store across the users sessions we set the colors into chrome local storage using the names boxcolor and highcolor as keys. When a user comes back or loads a page it calls the restoreColors() function which pulls from chrome local storage the desired colors. If no color is selected the defaults colors persists.

### _Does this extension integrate into Chromium?_ ###
Since we didn't implement our own API, this doesn't use Chromium.

#####  #####