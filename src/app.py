from flask import Flask, request, abort, url_for, redirect, session, render_template
from flask_sqlalchemy import SQLAlchemy
import os
from datetime import datetime, timedelta
import re
from flask_socketio import SocketIO
from models import *
from functions import *

template_dir = os.path.abspath('../templates')
static_dir =  os.path.abspath('../static')

app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(
    app.root_path, "database.db"
)
app.config.update(dict(
	DEBUG=True,
	SECRET_KEY='development key',
))
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

@app.route("/createaccount/", methods=["GET", "POST"])
def create_user():
    print("in create user")
    if "username" in session:
        return redirect(url_for("chat_page", username=session["username"]))
    elif(request.method == "POST"):
        if request.form['submit_button'] == 'login':
            return redirect(url_for("logger"))
        elif request.form['submit_button'] == 'signup':
            print("Checking if user exists")
            check = User.query.filter_by(username=request.form["username"]).first()
            if check:
                print("User Already Exists.")
            else:
                print("User does not exist, adding user")
                #need to do some user/password/email validation
                new = User(username=request.form["username"], password=request.form["password"], email=request.form["email"])
                db.session.add(new)
                db.session.commit()
                print("user successfully created.")
    return render_template("register.html")


@app.route("/", methods=["GET", "POST"])
def logger():
    if "username" in session:
        return redirect(url_for("chat_page", username=session["username"]))
    elif request.method == "POST":
        print("Request!")
        print(request.form['submit_button'])
        if request.form['submit_button'] == 'login':
            check = User.query.filter_by(username=request.form["username"]).first()
            if check:
                if check.password == request.form["password"]:
                    session["username"] = request.form["username"]
                    return redirect(url_for("chat_page"))
                else:
                    print("Wrong username or password")
            else:
                print("User does not exist.")
        if request.form['submit_button'] == 'create_account':
            print("going to create user?")
            return redirect(url_for("create_user"))
    return render_template("landing.html")

@app.route("/logout/")
def unlogger():
	# if logged in, log out, otherwise offer to log in
	if "username" in session:
		# note, here were calling the .clear() method for the python dictionary builtin
		session.clear()
        #send them back to the landing page
		return render_template("landing.html")
	else: 
		return redirect(url_for("logger"))

    #test to see if the user in current session
@app.route("/main/")
@app.route("/main/<username>", methods = ["POST","GET"])
def chat_page(username=None):
    #set the user, make sure there is a user in session
     
    #get all the groups of the user
    #groups = Group.query.filter_by(contact=currUser.id)
    return render_template("app.html")

@app.route("/contact_list/<username>", methods=["GET"])
def getContactList(username=None):
    #get the user
    currUser = User.query.filter_by(username=username).first_or_404()
    #return a list of all the contacts
    return listAllContacts(currUser.id)

@app.route("/group_list/<username>", methods=["GET"])
def getGroupList(username=None):
    #get the user
    currUser = User.query.filter_by(username=username).first_or_404()
    #return a list of all the contacts
    return listAllGroups(currUser.id)

#Profile Model
#----------CMDS
@app.cli.command("initdb")
def initdb():
    db.drop_all()
    db.create_all()
    #create test users
    Owner = User("owner", "pass", "bobchen0201@gmail.com")
    test1 = User("test1", "pass", "xzc@gmail.com")
    test2 = User("test2", "pass", "asdfe1@gmail.com")
    test3 = User("test3", "pass", "tra@gmail.com")
    test4 = User("test4", "pass", "yrty@gmail.com")
    test5 = User("test5", "pass", "uytu@gmail.com")
    test6 = User("test6", "pass", "ewren0201@gmail.com")
    test7 = User("test7", "pass", "bobchsdafn0201@gmail.com")
    test8 = User("test8", "pass", "adsfexcdn0201@gmail.com")
    test9 = User("test9", "pass", "bobrewrn0201@gmail.com")
    test10 = User("test10", "pass", "boberwerchen0201@gmail.com")
    test11 = User("test11", "pass", "btren0201@gmail.com")
    test12 = User("test12", "pass", "boytryen0201@gmail.com")
    db.session.add(Owner)
    db.session.add(test1)
    db.session.add(test2)
    db.session.add(test3)
    db.session.add(test4)
    db.session.add(test5)
    db.session.add(test6)
    db.session.add(test7)
    db.session.add(test8)
    db.session.add(test9)
    db.session.add(test10)
    db.session.add(test11)
    db.session.add(test12)
    #create test groups
    Group1 = Group()
    Group2 = Group()
    Group3 = Group()
    db.session.add(Group1)
    db.session.add(Group2)
    db.session.add(Group3)
    db.session.commit()
    #create test messages
    Message1 = Message(1, "Test Messageayererer111222323")
    Message2 = Message(1, "Test Messageayererer111222323")
    Message3 = Message(1, "Test Messageayererer1112224343")
    Message4 = Message(1, "Test Messageayererer1112224343")
    Message5 = Message(2, "Test Messageayerererxzc")
    Message6 = Message(2, "zxczsc")
    Message7 = Message(2, "Testasdasdssage")
    Message8 = Message(2, "Test Mewrweressage")
    Message9 = Message(2, "Ter342essage")
    Message10 = Message(2, "Testertessage")
    #continue creating test groups -- creating the connection between groups and users
    TestContact1 = GroupContact(1, 1)
    TestContact2 = GroupContact(1, 2)
    TestContact3 = GroupContact(2, 1)
    TestContact4 = GroupContact(2, 2)
    TestContact5 = GroupContact(2, 3)
    TestContact6 = GroupContact(1, 4)
    TestContact7 = GroupContact(1, 5)
    #add messages
    db.session.add(Message1)
    db.session.add(Message2)
    db.session.add(Message3)
    db.session.add(Message4)
    db.session.add(Message5)
    db.session.add(Message6)
    db.session.add(Message7)
    db.session.add(Message8)
    db.session.add(Message9)
    db.session.add(Message10)
    #add contacts
    db.session.add(TestContact1)
    db.session.add(TestContact2)
    db.session.add(TestContact3)
    db.session.add(TestContact4)
    db.session.add(TestContact5)
    db.session.add(TestContact6)
    db.session.add(TestContact7)
    #Generate test contact list
    rel1 = ContactList(test1.id, test2.id)
    rel2 = ContactList(test2.id, Owner.id)
    rel3 = ContactList(test3.id, Owner.id)
    rel4 = ContactList(test4.id, Owner.id)
    rel5 = ContactList(test5.id, Owner.id)
    rel6 = ContactList(test6.id, Owner.id)
    rel7 = ContactList(test7.id, Owner.id)
    rel8 = ContactList(test8.id, Owner.id)
    rel9 = ContactList(test9.id, test1.id)
    rel10 = ContactList(test12.id, test1.id)
    rel11 = ContactList(test11.id, test1.id)
    rel12 = ContactList(test10.id, test1.id)
    db.session.add(rel1)
    db.session.add(rel2)
    db.session.add(rel3)
    db.session.add(rel4)
    db.session.add(rel5)
    db.session.add(rel6)
    db.session.add(rel7)
    db.session.add(rel8)
    db.session.add(rel9)
    db.session.add(rel10)
    db.session.add(rel11)
    db.session.add(rel12)
    db.session.commit()
    print("Initialized the database.")

if __name__ == "__main__":
    app.run(threaded=True)