all the file you guys need for testing is in src, and to run the code
you need to install all the requirements, and for window you need to do:
set FLASK_APP=main.app
for mac: export FLASK_APP=main.app
then,  flask run
and if you want to initialize the database, you need to do 
flask restdb 

and if you want to see whats in the database, i recommand you to use vs code,
and do shift+ctrl+p, then search for SQLite:search for database, select the .db
file you generate out, and you should be able to see them in your right lower
corner. 

ps: everytime you create new user you need to click the refresh button in vs code
for you to see it changes. 