from flask import Flask, request, abort, url_for, redirect, session, render_template
from flask_sqlalchemy import SQLAlchemy
import os
from datetime import datetime, timedelta
import re
from flask_socketio import SocketIO
from models import db, User

app = Flask(__name__)

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
    if(request.method == "POST"):
        check = User.query.filter_by(username=request.form["user"]).first()
        if check:
            print("User Already Exists.")
        else:
            new = User(username=request.form["user"], password=request.form["pass"], email=request.form["email"])
            db.session.add(new)
            db.session.commit()
            print("user successfully created.")
    return render_template("create.html")


@app.route("/", methods=["GET", "POST"])
def logger():
    if "username" in session:
        return redirect(url_for("chat_page", username=session["username"]))
    elif request.method == "POST":
        if request.form['submit_button'] == 'create user':
            return redirect(url_for("create_user"))
        elif request.form['submit_button'] == 'submit':
            check = User.query.filter_by(username=request.form["user"]).first()
            if check.password == request.form["pass"]:
                session["username"] = request.form["user"]
                return redirect(url_for("chat_page"))
            else:
                print("wrong username or password")
    return render_template("loginPage.html")


    #test to see if the user in current session
@app.route("/main/", methods = ["POST","GET"])
def chat_page():
    session.clear()
    return render_template("app.html")


#Profile Model
#----------CMDS
@app.cli.command("resetdb")
def initdb():
    db.drop_all()
    db.create_all()
    Owner = User("owner", "pass", "bobchen0201@gmail.com")
    db.session.add(Owner)
    db.session.commit()
    print("Initialized the database.")

if __name__ == "__main__":
    app.run(threaded=True)