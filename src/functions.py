from models import *
from itertools import *
from math import *

def exists(id):
    check = User.query.filter_by(username=id).first()
    if not check:
        return None
    return check

def listAllContacts(id):
    list1 = ContactList.query.filter_by(user_id1=id).all()
    list2 = ContactList.query.filter_by(user_id2=id).all()
    list3 = list1 + list2
    list4 = []
    retVal = ""
    for user in list3:
        if(user.user_id1 != id):
            list4.append(User.query.filter_by(id=user.user_id1).first())
        else:
            list4.append(User.query.filter_by(id=user.user_id2).first())
    for user in list4:
        retVal += user.username
        retVal += ","
    return retVal

def listAllGroups(id):
    list1 = GroupContact.query.filter_by(user_id=id).all()
    list2 = ""
    for group in list1:
        check = GroupContact.query.filter_by(group_id=group.group_id).all()
        list2+= str(group.group_id) + ":"
        for currId in check:
            if(currId.user_id != id):
                list2 += User.query.filter_by(id=currId.user_id).first_or_404().username + " "
                print(User.query.filter_by(id=currId.user_id).first_or_404().username)
        list2+= ","
    return list2

def getID(username):
    user = User.query.filter_by(username=username).first_or_404()
    return user.id

def addFriend(id1, id2):
    #first check if they are already friends
    check1 = ContactList.query.filter_by(user_id1=id1, user_id2=id2).first()
    check2 = ContactList.query.filter_by(user_id1=id2, user_id2=id1).first()
    if check1 or check2:
        #they are already friends
        return False
    #add the user to the contact list
    contact = ContactList(id1, id2)
    db.session.add(contact)
    #initialize a group between the users
    newGroup = create_chat()
    #add both users to that group
    groupContact = GroupContact(newGroup.id, id1)
    groupContact2 = GroupContact(newGroup.id, id2)
    db.session.add(groupContact)
    db.session.add(groupContact2)
    db.session.commit()

def addToGroup(groupID, id):
    groupCheck = Group.query.filter_by(id=groupID).first_or_404()

    if groupCheck.is_group_chat is False:
        #group chat is a chat for only two people -- create a new group
        newGroup = create_group()
        #get previous members
        members = GroupContact.query.filter_by(group_id=groupID).all()
        for member in members:
            #add the members to the new group
            print(member)
            addToGroup(newGroup.id, member.user_id)
        #add the new member
        addToGroup(newGroup.id, id)
    else:
        #actually add the member to the group
        groupContact = GroupContact(groupID, id)
        db.session.add(groupContact)
        db.session.commit()

def sendMessage(userID, groupID, message):
    newMessage = Message(userID, groupID, message)
    db.session.add(newMessage)
    db.session.commit()

#creates a group for only 2 people
def create_chat():
    newGroup = Group()
    #add the session to group
    db.session.add(newGroup)
    #return the group
    db.session.commit()
    return newGroup

#creates a group for 2 or more people
def create_group():
    newGroup = Group()
    newGroup.is_group_chat = True
    #add the session to group
    db.session.add(newGroup)
    #return the group
    db.session.commit()
    return newGroup

def newUser(id, pw, email):
    newUser = User(id, pw, email)
    db.session.add(newUser)
    db.session.commit()
    return newUser
    
def get_chat_history(id, offset):
    if not offset or isnan(offset):
        offset = 0
    print("Id is : ")
    print(id)
    chatHistory = Message.query.filter_by(group_id=id).all()
    if chatHistory:
        limit = 50
        messages = ["" for x in range(len(chatHistory))]
        senders = [0 for x in range(len(chatHistory))]
        for idx, row in enumerate(reversed(chatHistory), start=offset):
            if idx >= limit:
                break
            if (idx + offset) >= len(chatHistory):
                break
            messages[idx] = row.message
            senders[idx] = row.sender_id
            retval = zip(messages, senders)
        return list(retval)
    return list(zip("No messages", 1))

#def lookup_user(userid):

#def delete_group(groupid):

#def send_request(requestorid, userid):

#def respond_request(requestid):

#def update_screen():