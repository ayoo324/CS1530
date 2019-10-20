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
    var element = document.getElementById(id);
    console.log(element.ClassList);
    if(element.classList.contains("column")){
        element.classList.remove("column");
        removeAll(id);
    }else{
        element.classList.add("column");
        console.log("test");

        //add all the contacts now
        element.innerHTML = "<p><button onclick=\"setContact(\'contact1\')\">contact1</button></p>"
        element.innerHTML += "<p><button onclick=\"setContact(\'contact2\')\">contact2</button></p>"
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