import datetime
import pathlib

from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

import config

ROOT = pathlib.Path(__file__).parent
templates_dirname = ROOT / config.TEMPLATES_DIRNAME


def start_app():

    app = Flask(__name__, template_folder=templates_dirname)
    app.config.from_object(config.AppConfig)
    db = SQLAlchemy(app)

    class Product(db.Model):
        __tablename__ = 'product'
        id = db.Column(db.Integer, primary_key=True)
        model = db.Column(db.String(255), nullable=False)
        name = db.Column(db.String(255), nullable=False)
        # created_date = db.Column(db.DateTime(), server_default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    class Passphrase(db.Model):
        __tablename__ = 'passphrase'
        id = db.Column(db.Integer, primary_key=True)
        passphrase = db.Column(db.String(255), nullable=False)
        product = db.Column(db.Integer, db.ForeignKey("product.id"), nullable=False)

    class ViewerPassphrase(db.Model):
        __tablename__ = 'viewer_passphrase'
        id = db.Column(db.Integer, primary_key=True)
        viewer = db.Column(db.Integer, db.ForeignKey("viewer.id"), nullable=False)
        passphrase = db.Column(db.Integer, db.ForeignKey("passphrase.id"), nullable=True)
        used = db.Column('used', db.Boolean(), nullable=False, server_default='1')

    class Viewer(db.Model):
        __tablename__ = 'viewer'
        id = db.Column(db.Integer, primary_key=True)
        username = db.Column(db.String(100), nullable=False, unique=True)
        user_agent = db.Column(db.String(255), nullable=False)
        email_confirmed_at = db.Column(db.DateTime())

        def __repr__(self):
            return '<Viewer %r>' % self.user_agent

    db.create_all()

    @app.route('/')
    def index():
        # String-based templates
        return  render_template('index.html')

    return app

if __name__ == '__main__':
    app = start_app()
    app.run(host='0.0.0.0', port=80)
