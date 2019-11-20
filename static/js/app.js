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
//-------------
var curr_user_displayname;
function show_message(responseText){
    curr_user_displayname = JSON.parse(responseText);
    document.getElementById("display_name1").innerHTML= "display name: "+ curr_user_displayname;

    //alert("this is ：" + curr_user_displayname);
}
function change_display_name(){
    username = document.URL.split('/').pop();
    new_display_name = document.getElementById("usernameA").value;
    makeReq("POST", "/change_display_name/" + username + "/" + new_display_name, 200, null);
    alert("display name changed");
}
function profileScreen(id){
    removeAll(id);
    username = document.URL.split('/').pop();
    makeReq("GET", "/show_profile_name/" + username, 200, show_message);
    //document.getElementById(id).innerHTML = "Profile Test! " + username;
    panel = document.getElementById(id);
    panel.innerHTML = "";   
    var img = document.createElement("img");
    img.setAttribute("id", "profileppp");
    makeReq("GET", "/show_profile_picture/" + username, 200, show_message1);
    console.log(img);
    panel.innerHTML = "Pofile Page ";
// email, username and displayname
    var username1 = document.createElement("P");
    username1.innerHTML = "username: " + username;
    panel.appendChild(username1);

    var display_name1 = document.createElement("P");
    display_name1.setAttribute("id", "display_name1");
    panel.appendChild(display_name1);

    var email = document.createElement("P");
    email.setAttribute("id", "email_address");
    makeReq ("GET", "/email_address/" +username, 200, show_email);
    panel.appendChild(email);
    console.log(curr_user_displayname);
    //alert(curr_user_displayname);
    panel.appendChild(img);
    see2 = document.createElement("changeButton");
    see2.innerHTML = "<p><button onclick=\"change_profile_pic()\">change pic</button>";  
    buttons = document.createElement("buttons");
    see = document.createElement("changeButton");
    textArea3 = document.createElement("textarea");
    textArea3.classList.add("new_display_name");
    textArea3.placeholder = "new_display_name...";
    textArea3.id = "usernameA";
    see1 = document.createElement("submitButton");
    textArea2 = document.createElement("textarea");
    textArea2.classList.add("old_password");
    textArea2.placeholder = "old_password...";
    textArea2.id = "old_password";
    textArea1 = document.createElement("textarea");
    textArea1.classList.add("new_password");
    textArea1.placeholder = "new_password...";
    textArea1.id = "new_password";
    see.innerHTML = "<p><button onclick=\"change_display_name()\">change name</button>";
    see1.innerHTML = "<p><button onclick=\"check_password()\">change pw</button>";
    see.classList.add("change_button");
    var x = document.createElement("SELECT");
    x.setAttribute("id", "mySelect");
    panel.appendChild(x);  
    var z = document.createElement("option");
    z.setAttribute("value", "apple");
    var z1= document.createElement("option");
    z1.setAttribute("value", "banana");
    var t = document.createTextNode("apple");
    var t1 = document.createTextNode("banana");
    z.appendChild(t);
    z1.appendChild(t1);
    document.getElementById("mySelect").appendChild(z);
    document.getElementById("mySelect").appendChild(z1);
    console.log(x.value);
    panel.appendChild(textArea3);
    panel.appendChild(textArea2);
    panel.appendChild(textArea1);
    buttons.appendChild(see2);
    buttons.appendChild(see);
    buttons.appendChild(see1);
    panel.appendChild(buttons);
    //get the user information from profile.db

    //makeReq("POST", "/chang_password/" + username + "/" + new_password, 200, null);
    //alert("newpassword");



    currScreen = 1;
    lastTimeStamp = 0;
    console.log(currScreen);
}
function check_password(){
    username = document.URL.split('/').pop();
    makeReq("GET", "/show_password/" + username, 200, check_password2);
}

function check_password2(responseText){
    old_password1 = document.getElementById("old_password").value;
    new_password = 
    curr_password = JSON.parse(responseText);
    if (old_password1 === curr_password){
        new_password = document.getElementById("new_password").value;
        if (new_password === ""){
            alert("your new password cannot be empty");}
        else{
            makeReq("POST", "/chang_password/" + username + "/" + new_password, 200, null);}     
    }
    else{
        alert("you typed in old password wrong");
    }

}
function change_profile_pic(){
    pic_select = document.getElementById("mySelect").value;
    console.log(pic_select);
    makeReq("POST", "/change_profile_pic/" + username + "/" + pic_select, 200, null);
    alert("success");
}
function show_message1(responseText){
    user_pic= JSON.parse(responseText);
    if(user_pic === null){
        user_pic = "default";
    }
    document.getElementById("profileppp").src = "../static/images/" + user_pic + ".png";
    console.log(document.getElementById("profileppp").src);
}

function show_email(responseText){
    user_email= JSON.parse(responseText);
    document.getElementById("email_address").innerHTML = "email: "+ user_email;
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
    currScreen = 2;
    lastTimeStamp = 0;
    //our look up users page, can delete add and look up users here
    panel = document.getElementById(element);
    panel.innerHTML = "";
    buttons = document.createElement("buttons");
    buttons.classList.add("userRow");
    search = document.createElement("searchButton");
    req = document.createElement("addButton");
    remove = document.createElement("removeButton");
    textArea = document.createElement("textarea");
    textArea.placeholder = "Type username here...";
    textArea.name = "msg";
    textArea.classList.add("lookupuser");
    textArea.id = "usernameArea";
    panel.appendChild(textArea);
    req.innerHTML = "<p><button onclick=\"createRequest()\">Add</button>"
    req.classList.add("userButtons");
    remove.innerHTML = "<p><button onclick=\"removeUser()\">Remove</button>"
    remove.classList.add("userButtons");
    search.innerHTML = "<p><button onclick=\"findUser()\">Search</button>"
    search.classList.add("userButtons");
    buttons.appendChild(req);
    buttons.appendChild(remove);
    buttons.appendChild(search);
    panel.appendChild(buttons);
    makeReq("GET", "/requests/" + document.URL.split('/').pop(), 200, getRequests);
}
function removeUser(){
    username = document.getElementById("usernameArea").value;
    console.log(username);
    element = document.getElementById("response_area");
    currUser = document.URL.split('/').pop();
    if(username != currUser)
        makeReq("POST", "/remove/" + document.URL.split('/').pop(), 200, removeContact, username);
    else
        element.innerHTML = "You cannot delete yourself. That's illegal, I'm calling the police";
}
function removeContact(responseText){
    console.log("remove response:")
    console.log(responseText);
}
function getRequests(responseText){
    console.log("Getting requests");
    requests = JSON.parse(responseText);
    console.log(requests);
    var element = document.getElementById("lastColumn");
    var responseDiv = document.createElement("ResponseArea");
    responseDiv.id = "response_area";
    responseDiv.classList.add("responseFromServer");
    element.appendChild(responseDiv);
    var newElement = document.createElement("requestDiv");
    newElement.classList.add("scrollable");
    for(var i = 0; i < requests.length; i++){
        var currElement = document.createElement("requestor");
        currElement.id = "request_" + i;
        var accept = document.createElement("acceptButton");
        var deny = document.createElement("denyButton");
        currElement.innerHTML = requests[i];
        accept.innerHTML = "<p><button id=\"accept_" + requests[i] + "\"onclick=\"respondRequest(this.id," + currElement.id + ")\" >Accept</button>";
        deny.innerHTML = "<p><button id=\"deny_" + requests[i] + "\" onclick=\"respondRequest(this.id," + currElement.id + ")\">Deny</button>"; 
        currElement.appendChild(accept);
        currElement.appendChild(deny);
        newElement.appendChild(currElement);   
    }
    element.appendChild(newElement);
}
function respondRequest(username, element){
    console.log(username);
    console.log(element);
    var arr = username.split("_");
    console.log(arr[0]);
    console.log(arr[1]);
    makeReq("POST", "/request/" + document.URL.split('/').pop(), 200, null, username);
    removeAll(element.id);
}
function createRequest(){
    username = document.getElementById("usernameArea").value;
    console.log(username);
    element = document.getElementById("response_area");
    adder = document.URL.split('/').pop();
    if(username != adder)
        makeReq("POST", "/requests/" + document.URL.split('/').pop(), 200, null, username);
    else
        element.innerHTML = "You cannot add yourself. That's illegal";
}
function findUser(){
    username = document.getElementById("usernameArea").value;
    makeReq("GET", "/users/" + username, 200, userFound);
}
function userFound(responseText){
    console.log(responseText);
    element = document.getElementById("response_area");
    console.log(parseInt(responseText));
    if(responseText == "-1")   
        element.innerHTML = "No username entered";
    else if(responseText == "-2")
        element.innerHTML = "Username does not exist.";
    else
        element.innerHTML = JSON.parse(responseText) + " exists.";
}
function leave_group(){
    username = document.getElementById("usernameArea").value;
    console.log(username);
    makeReq("POST", "/leave_group/" + document.URL.split('/').pop(), 200, removegroup, username)
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
    
}function display_chat(responseText){
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
