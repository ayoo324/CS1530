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
    userlevel = db.Column(db.Integer, unique=False)
    appointment = db.relationship('Appointment', backref="user",lazy='select')

    def __init__(self, username, password, level):
        self.username = username
        self.password = password
        self.userlevel = level

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