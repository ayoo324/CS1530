//Functions for XMLHttpRequest
function makeReq(method, target, retCode, action, data) {
    var httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }

    httpRequest.onreadystatechange = makeHandler(httpRequest, retCode, action);
    httpRequest.open(method, target);

    if (data) {
        httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        httpRequest.send(data);
    }
    else {
        httpRequest.send();
    }
}
function makeHandler(httpRequest, retCode, action) {
    function handler() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === retCode && action != null) {
                action(httpRequest.responseText);
            }
            if (httpRequest.status !== retCode){
                alert("There was a problem");
            }
        }
    }
    return handler;
}
var ContactList;
var lastButton = null;
var currContact = null;
var prevContact = null;
var currScreen = null;
function removeAll(id){
    const myNode = document.getElementById(id);
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }
}
function chatScreen(id){
    if(currContact == null)
        document.getElementById(id).innerHTML = "no contact selected!";
    else if(currContact == prevContact && currScreen == 0){
        console.log("no change");
    }
    else{
        removeAll(id);
        var element = document.getElementById(id);
        element.innerHTML = "<p> Chat test! With contact : " + currContact + "</p>";
        prevContact = currContact;
        //add messages here
        var chatElement = document.createElement("chat");
        chatElement.classList.add("scrollable");
        //for testing message scrolling
        //for(var i = 0; i < 600; i++)
        //    chatElement.innerHTML += "<p> some random stuff yo </p>";
        element.appendChild(chatElement);
        //message bar
        var newElement = document.createElement("messagebar");
        newElement.innerHTML += `<p>
        <label for=\"msg\"><b>Message</b></label>
        <textarea placeholder=\"Type message...\" name=\"msg\" required>
        </textarea><button type=\"submit\" class=\"btn\">Send</button>
        </p>
        `;
        newElement.style.display = "block";
        newElement.style.verticalAlign = "bottom";
        newElement.style.position = "sticky";
        element.appendChild(newElement);
        
    }
    currScreen = 0;
}
function profileScreen(id){
    removeAll(id);
    document.getElementById(id).innerHTML = "Profile test! " + currContact;
    currScreen = 1;
}
function contacts(id){
    ContactList = document.getElementById(id);
    console.log(ContactList.ClassList);
    console.log(document.URL);
    if(ContactList.classList.contains("column")){
        ContactList.classList.remove("column");
        removeAll(id);
    }else{
        username = document.URL.split('/').pop();
        console.log(username);
        ContactList.classList.add("column");
        console.log("test");
        makeReq("GET", "/contact_list/" + username, 200, createContactList)
        
    }
}
function createContactList(responseText){
    console.log(responseText);
    //split the response text into usernames
    var usernames = responseText.split(",");
    usernames.pop();
    console.log(usernames);
    for(var i = 0; i < usernames.length; i++){
        var curr = usernames[i].split(":");
        toAdd = "";
        toAdd += "<p><button onclick=\"setContact(\'" + curr[0] + "\')\">";
        for(var j = 1; j < curr.length; j++){
            toAdd += " "+ curr[j];
        }
        toAdd += "</button></p>";
        ContactList.innerHTML += toAdd;
        //console.log("hey the username is: ");
        //console.log(usernames[i]);
    }
}
function setContact(id){
    prevContact = currContact;
    currContact = id;
    if(currScreen == 0){
        chatScreen('lastColumn');
    }else if(currScreen == 1){
        profileScreen('lastColumn');
    }
}