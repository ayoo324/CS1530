#-----------MODELS
# User Model
class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), unique=True)
    password = db.Column(db.String(30), unique=False)
    email = db.Column(db.String(30), unique=True)
    profile = db.relation("Profile", backref="user", lazy='select')
    def __init__(self, username, password, email):
        self.username = username
        self.password = password
        self.email = email
    
    def login(self):

    def logout(self):
# Group Model

# Profile Model

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
