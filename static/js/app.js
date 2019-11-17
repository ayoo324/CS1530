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
var node = null;
function removeAll(id){
    const myNode = document.getElementById(id);
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }
}
function chatScreen(id){
    console.log(id);
    if(currGroup == null)
        document.getElementById(id).innerHTML = "no contact selected!";
    else if(currGroup == prevGroup && currScreen == 0){
        console.log("no change");
    }
    else{
        removeAll(id);
        var element = document.getElementById(id);
        prevGroup = currGroup;  
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
        makeReq("GET", "/picture/group/" + id, 200, display_pictures);
        //display messages
        makeReq("GET", "/group/" + id, 200, display_chat);
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
    document.getElementById(id).innerHTML = "Profile test! " + currGroup;
    currScreen = 1;
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
        //display messages
        makeReq("GET", "/group/" + id, 200, display_chat);
    }else if(currScreen == 1){
        profileScreen('lastColumn');
    }
    
}
function display_chat(responseText){
    if(currScreen == 0){
        var chatElement = document.getElementById("chatElement");
        chatElement.innerHTML = "";
        var response = JSON.parse(responseText);
        console.log(response)
        var node = document.createElement("emptyNode");
        chatElement.appendChild(node);
        //add messages here  
        if(Array.isArray(response)){
            username = document.URL.split('/').pop();
            console.log(username);
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