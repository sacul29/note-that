// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


document.addEventListener('DOMContentLoaded', function () {
  var button = document.getElementById("button")
  button.addEventListener('click', click);
});



/*
* When clicked it sends a message to the tab containing the typed text.
*/
function click(e) {
  var nameButton = document.getElementById("comment");
  var enteredText = nameButton.value;
  //nameButton.value = "Goodbye!"
  //nameButton.value=enteredText;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {greeting: enteredText}, function(response) {
    console.log(response.farewell);
  });
});
}







