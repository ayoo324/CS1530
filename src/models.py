#-----------MODELS
# User Model
from flask_sqlalchemy import SQLAlchemy
import datetime
 
db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), unique=True)
    password = db.Column(db.String(30), unique=False)
    email = db.Column(db.String(30), unique=True)
    profile = db.relation('Profile', backref="user", lazy='select')
    def __init__(self, username, password, email):
        self.username = username
        self.password = password
        self.email = email
    
class Group(db.Model):
    id = db.Column(db.Integer, primary_key = True, unique = True) 
    #chat_history = db.Column(db.String, nullable = True)
    chat_history = db.relationship('Message', backref="group", lazy='select')
    contact = db.relationship('GroupContact', backref="group", lazy='select')

class Message(db.Model):
    id = db.Column(db.Integer, primary_key = True, unique=True)
    group_id = db.Column(db.Integer, db.ForeignKey('group.id'))
    message = db.Column(db.String, nullable = False) 
    
    def __init__(self, groupid, message):
        self.group_id = groupid
        self.message = message

class Profile(db.Model):
    id = db.Column(db.Integer, primary_key = True, unique = True) 
    pic_path = db.Column(db.String, nullable = True) #need to check whether its a path or not and it can be empty
    uID = db.Column(db.Integer, db.ForeignKey('user.id'))
    display_name = db.Column(db.String, unique = False)
    def __init__(self, pic_path, uID):
        self.pic_path = pic_path
        self.uID = uID
    
class GroupContact(db.Model):
    id = db.Column(db.Integer, primary_key = True, unique = True) 
    group_id = db.Column(db.Integer, db.ForeignKey('group.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    def __init__(self, group, id):
        self.group_id = group
        self.user_id = id

class ContactList(db.Model):
    id = db.Column(db.Integer, primary_key = True, unique = True) 
    user_id1 = db.Column(db.Integer, db.ForeignKey('user.id'))
    user_id2 = db.Column(db.Integer, db.ForeignKey('user.id'))
    def __init__(self, id1, id2):
        self.user_id1 = id1
        self.user_id2 = id2
        
def listAllContacts(id):
    list1 = ContactList.query.filter_by(user_id1=id).all()
    list2 = ContactList.query.filter_by(user_id2=id).all()
    list3 = list1 + list2
    list4 = []
    for x in list3:
        if(x.user_id1 != id):
            list4.append(User.query.filter_by(id=x.user_id1).first())
        else:
            list4.append(User.query.filter_by(id=x.user_id2).first())
    return list4

class Request(db.Model):
    request_id = db.Column(db.Integer, primary_key=True, unique=True)
    #who is being requested to join a group
    requestee = db.Column(db.Integer, db.ForeignKey('user.id'))
    #who made the request in the first place
    requestor = db.Column(db.Integer, db.ForeignKey('user.id'))
    def __init__(self, requesteeid, requestorid):
        self.requestee = requesteeid
        self.requstore = requestorid
# PROGRAMMING NOTES

#There will be a separate  table that has all group ids listed with each user id
# example table:
#   GROUP ID        USER ID
#   0                 1
#   0                 2
#   1                 1
#   1                 3

#There will also be a separate table for requests
#Example table:
#   id of request   who made request    who will respond to the request
#   REQUEST ID      REQUESTEE ID       REQUESTOR ID
#       0               1               2
#       0               1               3
