from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class StoryProgress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    interest = db.Column(db.String(200), nullable=False)
    moment = db.Column(db.String(300), nullable=False)
    current_node = db.Column(db.String(50), nullable=False, default='start')
    # We'll store the history as a JSON string (list of dicts)
    history = db.Column(db.Text, nullable=False, default="[]")
