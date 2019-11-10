from models import *
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
    list2 = []
    retVal = ""
    for group in list1:
        list2.append(Group.query.filter_by(id=group.group_id))
    
    return retVal

#def create_group(userid1, userid2):

#def lookup_user(userid):

#def delete_group(groupid):

#def send_request(requestorid, userid):

#def respond_request(requestid):

#def update_screen():