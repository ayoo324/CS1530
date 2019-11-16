from flask import Flask, request, abort, url_for, redirect, session, render_template, jsonify
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
                    return redirect(url_for("chat_page", username=session["username"]))
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
        #change to logout page
		return redirect(url_for("logger"))
	else: 
		return redirect(url_for("logger"))

    #test to see if the user in current session
@app.route("/main/")
@app.route("/main/<username>", methods = ["POST","GET"])
@app.route("/main/<username>/group/<groupid>", methods = ["POST","GET"])
@app.route("/main/<username>/profile/<profileid>", methods = ["POST","GET"])
def chat_page(username=None, groupid=None, profileid=None):
    #set the user, make sure there is a user in session
     
    #get all the groups of the user
    #groups = Group.query.filter_by(contact=currUser.id)
    return render_template("app.html")
@app.route("/group/<groupid>", methods = ["POST","GET"])
@app.route("/group/<groupid>/<offset>", methods = ["POST","GET"])
def get_chathistory(groupid=None, offset=None):
    return jsonify(get_chat_history(groupid, offset))
    
@app.route("/contact_list/<username>", methods=["GET"])
def getContactList(username=None):
    #check if user is in session
    if "username" not in session:
        #send them back to the landing page
        return render_template("landing.html")
    #return a list of all the contacts
    return listAllGroups(getID(username))

#Profile Model
#----------CMDS
@app.cli.command("initdb")
def initdb():
    db.drop_all()
    db.create_all()
    #create test users
    Owner = newUser("owner", "pass", "bobchen0201@gmail.com")
    test1 = newUser("test1", "pass", "xzc@gmail.com")
    test2 = newUser("test2", "pass", "asdfe1@gmail.com")
    test3 = newUser("test3", "pass", "tra@gmail.com")
    test4 = newUser("test4", "pass", "yrty@gmail.com")
    test5 = newUser("test5", "pass", "uytu@gmail.com")
    test6 = newUser("test6", "pass", "ewren0201@gmail.com")
    test7 = newUser("test7", "pass", "bobchsdafn0201@gmail.com")
    test8 = newUser("test8", "pass", "adsfexcdn0201@gmail.com")
    test9 = newUser("test9", "pass", "bobrewrn0201@gmail.com")
    test10 = newUser("test10", "pass", "boberwerchen0201@gmail.com")
    test11 = newUser("test11", "pass", "btren0201@gmail.com")
    test12 = newUser("test12", "pass", "boytryen0201@gmail.com")
   #Generate test contact list
    addFriend(getID("test1"), getID("test2"))
    addFriend(test1.id, test2.id)
    addFriend(test2.id, Owner.id)
    addFriend(test3.id, Owner.id)
    addFriend(test4.id, Owner.id)
    addFriend(test5.id, Owner.id)
    addFriend(test6.id, Owner.id)
    addFriend(test7.id, Owner.id)
    addFriend(test8.id, Owner.id)
    addFriend(test9.id, test1.id)
    addFriend(test12.id, test1.id)
    addFriend(test11.id, test1.id)
    addFriend(test10.id, test1.id)
    #create test messages
    sendMessage(2, 1, "Test Messageayererer111222323")
    sendMessage(2, 1, "Test Messageayererer111222323")
    sendMessage(3, 1, "Test Messageayererer1112224343")
    sendMessage(3, 1, "Test Messageayererer1112224343")
    sendMessage(1, 2, "Test Messageayerererxzc")
    sendMessage(1, 2, "zxczsc")
    sendMessage(1, 2, "Testasdasdssage")
    sendMessage(3, 2, "Test Mewrweressage")
    sendMessage(3, 2, "Ter342essage")
    sendMessage(3, 2, "Testertessage")
    
    addToGroup(2, test10.id)
    
    
    print("Initialized the database.")

if __name__ == "__main__":
    app.run(threaded=True)