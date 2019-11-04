#-----------MODELS
# User Model
from flask_sqlalchemy import SQLAlchemy
import datetime
 
db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
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
    chat_history = db.Column(db.String, nullable = True)  #stores list of string as chat history
#add property to store in list form
    def __init__(self, chat_history):
        self.chat_history = chat_history


class Profile(db.Model):
    id = db.Column(db.Integer, primary_key = True, unique = True) 
    pic_path = db.Column(db.String, nullable = True) #need to check whether its a path or not and it can be empty
    uID = db.Column(db.Integer, db.ForeignKey('user.id'))
    display_name = db.Column(db.String, unique = False)
    def __init__(self, pic_path, uID):
        self.pic_path = pic_path
        self.uID = uID
    

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
