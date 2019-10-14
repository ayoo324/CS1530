function removeAll(id){
    const myNode = document.getElementById(id);
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }
}
function chatScreen(id){
    removeAll(id);
    document.getElementById(id).innerHTML = "chat test!";
}
function profileScreen(id){
    removeAll(id);
    document.getElementById(id).innerHTML = "Profile test!";
}
function stories(id){
    removeAll(id);
    document.getElementById(id).innerHTML = "story test";
}