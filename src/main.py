from flask import Flask, request, abort, url_for, redirect, session, render_template
from flask_sqlalchemy import SQLAlchemy
import os
from datetime import datetime, timedelta
import re
from flask_socketio import SocketIO

app = Flask(__name__)

app.config.update(dict(
	DEBUG=True,
	SECRET_KEY='development key',
	SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(app.root_path, 'database.db')
))

db = SQLAlchemy(app)

#-----------MODELS
# EXAMPLE MODEL
class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), unique=True)
    password = db.Column(db.String(30), unique=False)

    def __init__(self, username, password, level):
        self.username = username
        self.password = password

    def __repr__(self):
        return '<User %r>' % self.username

#----------CMDS
@app.cli.command("resetdb")
def initdb():
    db.drop_all()
    db.create_all()
    Owner = User("owner", "pass", 0)
    db.session.add(Owner)
    db.session.commit()
    print('Initialized the database.')

#------------PAGES
#default app route
@app.route("/")
def default():
    return redirect(url_for("logger"))

@app.route("/login/", methods=["GET", "POST"])
def logger():
    if "username" in session:
        return redirect(url_for("profile", username=session["username"]))
    elif request.method == "POST":
        if request.form['submit_button'] == 'create user':
            check = User.query.filter_by(username=request.form["user"]).first()
            if check:
                print("User Already Exists.")
            else:
                new = User(request.form["user"], request.form["pass"],2)
                db.session.add(new)
                db.session.commit()
                print("User successfully created.")
        elif request.form['submit_button'] == 'submit':
            check = User.query.filter_by(username=request.form["user"]).first()
            if check.password == request.form["pass"]:
                session["username"] = request.form["user"]
                return redirect(url_for("profile", username=session["username"]))
            else:
                print("Wrong password.")
    return render_template("loginPage.html")