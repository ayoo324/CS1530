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
class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), unique=True)
    password = db.Column(db.String(30), unique=False)
    userlevel = db.Column(db.Integer, unique=False)
    appointment = db.relationship('Appointment', backref="user",lazy='select')

    def __init__(self, username, password, level):
        self.username = username
        self.password = password
        self.userlevel = level

    def __repr__(self):
        return '<User %r>' % self.username
        
class Appointment(db.Model):
    __tablename__ = 'appointment'
    id = db.Column(db.Integer, primary_key=True)
    stylist_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    stylist = db.relationship("User", back_populates="appointment")
    stylist_username = db.Column(db.String(30), unique=False)
    time = db.Column(db.DateTime)
    patron_username = db.Column(db.String(30), unique=False)
    
    def __init__(self, time, patron,stylist):
        self.time = time
        self.patron_username = patron.username
        self.stylist_username = stylist.username



#------- OTHER EXAMPLES FROM GAME
class GameList(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    winner_id = db.Column(db.Integer, unique=False)

class Player(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False, unique=True)
    birthday = db.Column(db.Date, nullable=False)
    user = db.relationship('User', backref="player", lazy='select')
    #top10 = db.Column(db.ARRAY(db.String), unique=False)

    def birthday_format(self, format=None):
        if not format:
            return datetime.date.strftime('%B %d, %Y', self.birthday)
        else:
            return datetime.date.strftime(format, self.birthday)

    def games(self):
        return db.session.query(Game).filter(db.or_(Game.player_one_id==self.id, Game.player_two_id==self.id)).all()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), unique=True)
    password = db.Column(db.String(30), unique=False)
    player_id = db.Column(db.Integer, db.ForeignKey('player.id'))

class Game(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    player_one_id = db.Column(db.Integer, db.ForeignKey('player.id'))
    player_two_id = db.Column(db.Integer, db.ForeignKey('player.id'))
    turn = db.Column(db.Integer, nullable=False, default=0)
    game_over = db.Column(db.Boolean, nullable=False, default=False)
    winner_id = db.Column(db.Integer, db.ForeignKey('player.id'))
    player_one = db.relationship('Player', foreign_keys=[player_one_id], backref='games_player_one')
    player_two = db.relationship('Player', foreign_keys=[player_two_id], backref='games_player_two')
    winner = db.relationship('Player', foreign_keys=[winner_id], backref='games_winner')
    game_state = db.Column(db.String(1000), unique=False)
    #top10 = db.Column(db.ARRAY(db.String), unique=False)

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