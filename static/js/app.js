var timeout = 750;
var lastTimeStamp = 0;
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
var currGroup = null;
var prevGroup = null;
var currScreen = null;
var prevScreen = null;
var node = null;
function removeAll(id){
    const myNode = document.getElementById(id);
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }
}
function chatScreen(id){
    console.log(id);
    console.log("Chat screen");
    if(currGroup == null)
        document.getElementById(id).innerHTML = "no contact selected!";
    else if(currGroup == prevGroup && currScreen == 0){
        console.log("no change");
    }
    else{
        removeAll(id);
        var element = document.getElementById(id);
        //create the group info element
        var groupInfoElement = document.createElement("groupInfo");
        groupInfoElement.classList.add("groupinfo");
        groupInfoElement.id = "groupElement";
        groupInfoElement.innerHTML = "<p> Chat test! With contact : " + currGroup + "</p>";
        element.appendChild(groupInfoElement);
        //create the chat element
        var chatElement = document.createElement("chat");
        chatElement.classList.add("scrollable");  
        chatElement.id = "chatElement";
        element.appendChild(chatElement);
        console.log(chatElement.id);
        //display contact info
        makeReq("GET", "/picture/group/" + currGroup, 200, display_pictures);
        //display messages
        makeReq("GET", "/group/" + currGroup, 200, display_chat);
        //message bar
        var newElement = document.createElement("messagebar");
        newElement.classList.add("textBarWrapper");
        var textArea = document.createElement("textarea");
        textArea.placeholder = "Press enter to submit...";
        textArea.name = "msg";
        textArea.classList.add("textToSend");
        textArea.id = "textArea";
        textArea.addEventListener("keypress", submitOnEnter);
        newElement.appendChild(textArea);
        element.appendChild(newElement);
        setTimeout(poller, timeout);
    }
    currScreen = 0;
}
function eraseChatBar(){
    var element = document.getElementById("textArea");
    element.value = "";
}
function submitOnEnter(event){
    if(event.which === 13){
        sendMessage();
        event.preventDefault(); // Prevents the addition of a new line in the text field (not needed in a lot of cases)
        eraseChatBar();
    }
}
function profileScreen(id){
    removeAll(id);
    document.getElementById(id).innerHTML = "Profile test! " + currGroup;
    currScreen = 1;
    lastTimeStamp = 0;
    console.log(currScreen);
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
function lookup(element){
    //our look up users page, can delete add and create groups here
    panel = document.getElementById(element);
    panel.innerHTML = "";
    buttons = document.createElement("buttons");
    buttons.classList.add("userRow");
    search = document.createElement("searchButton");
    add = document.createElement("addButton");
    remove = document.createElement("removeButton");
    textArea = document.createElement("textarea");
    textArea.placeholder = "Type username here...";
    textArea.name = "msg";
    textArea.classList.add("lookupuser");
    textArea.id = "usernameArea";
    panel.appendChild(textArea);
    add.innerHTML = "<p><button onclick=\"addUser()\">Add</button>"
    add.classList.add("userButtons");
    remove.innerHTML = "<p><button onclick=\"removeUser()\">Remove</button>"
    remove.classList.add("userButtons");
    search.innerHTML = "<p><button onclick=\"findUser()\">Search</button>"
    search.classList.add("userButtons");
    buttons.appendChild(add);
    buttons.appendChild(remove);
    buttons.appendChild(search);
    panel.appendChild(buttons);
}
function addUser(){
    username = document.getElementById("usernameArea").value;
    console.log(username);
    console.log(document.URL.split('/').pop());
}
function findUser(){
    username = document.getElementById("usernameArea").value;
    console.log(username);
}
function removeUser(){
    username = document.getElementById("usernameArea").value;
    console.log(username);
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
        //sets the group id to the button id, so when set group is called, it sets the group to the groupid
        toAdd += "<p><button onclick=\"setGroup(\'" + curr[0] + "\')\">";
        for(var j = 1; j < curr.length; j++){
            //adds the name of everyone in the group EXCEPT the current user
            toAdd += " "+ curr[j];
        }
        //finishes each button
        toAdd += "</button></p>";
        //adds the button to the html
        ContactList.innerHTML += toAdd;
    }
}
function setGroup(id){
    prevGroup = currGroup;
    currGroup = id;
    console.log(currScreen);
    if(currScreen == 0){
        chatScreen('lastColumn');
        console.log("Set group");
        console.log(id);
        //display contact info
        makeReq("GET", "/picture/group/" + id, 200, display_pictures);
    }else if(currScreen == 1){
        profileScreen('lastColumn');
    }
    
}
function display_chat(responseText){
    var response = JSON.parse(responseText);
    if(currScreen == 0){
        if(Array.isArray(response)){
            username = document.URL.split('/').pop();
            console.log(username);
            if(response[0][2] == lastTimeStamp && currGroup == prevGroup){
                return 0;
            }
            prevGroup = currGroup;
            var chatElement = document.getElementById("chatElement");
            var node = document.createElement("emptyNode");
            chatElement.innerHTML = "";
            chatElement.appendChild(node);
            //add messages here  
            lastTimeStamp = response[0][2];
            for(var i = 0 ; i < response.length; i++){
                var newNode = document.createElement("msgBLOCK"); 
                newNode.classList.add("message");            
                var sender = document.createElement("sender");
                sender.classList.add("sender");
                var message = document.createElement("msgtext");
                message.classList.add("text");
                var timestamp = document.createElement("timestamp");
                timestamp.classList.add("timestamp")
                sender.innerHTML = response[i][1];
                message.innerHTML = response[i][0];
                timestamp.innerHTML = response[i][2];
                newNode.appendChild(sender);
                newNode.appendChild(message);
                newNode.appendChild(timestamp);
                chatElement.insertBefore(newNode, node);
                node = newNode;
            }
            chatElement.scrollTop = chatElement.scrollHeight;
        }
    }
}
function display_pictures(responseText){
    var response = JSON.parse(responseText);
    console.log(response);
    var header = document.getElementById("groupElement");
    header.classList.add("group");
    header.innerHTML = "";
    for(var i = 0; i < response.length; i++){
        var picture = document.createElement("img");
        picture.src = "../static/images/" + response[i][1] + ".png";
        picture.classList.add("picture");
        var name = document.createElement("name");
        name.classList.add("displayName");
        name.innerHTML = response[i][0] + " ";
        header.appendChild(picture);
        header.appendChild(name);
    }
}
function sendMessage(){
    var textToSend = document.getElementById("textArea").value;
    console.log(textToSend);
    username = document.URL.split('/').pop();
    makeReq("POST", "/send/" + username + "/" + currGroup + "/" + textToSend, 200, null, textToSend);
}
function poller(){
    if(currScreen == 0){
        makeReq("GET", "/group/" + currGroup, 200, display_chat);
        setTimeout(poller, timeout);
    }
}