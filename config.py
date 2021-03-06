import os

DEBUG = True

# export DATABASE_URL = f'{DB.type}://{DB.username}:{DB.password}@{DB.host}/{DB.name}'

TEMPLATES_DIRNAME = 'templates'

class DB:
    type = 'postgresql'
    name = 'festival'
    username = 'wedding'
    password = 'wedding'
    host = 'localhost'


class AppConfig(object):
    DEBUG = DEBUG
    CSRF_ENABLED = True
    SECRET_KEY = 'This is mahi first wedding project... Use it w1s3ly.'
    USER_APP_NAME = "Festival On"
    USER_ENABLE_EMAIL = True
    USER_ENABLE_USERNAME = True
    USER_REQUIRE_RETYPE_PASSWORD = True
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']