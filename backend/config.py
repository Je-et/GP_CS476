from decouple import config
import os

# Obtain the current file's base directory.
BASE_DIR=os.path.dirname(os.path.realpath(__file__))

class Config:
    # Load the secret key  and SQLAlchemy track modifications setting from .env file
    SECRET_KEY=config('SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS=config('SQLALCHEMY_TRACK_MODIFICATIONS', cast=bool)\

class DevConfig(Config):
    SQLALCHEMY_DATABASE_URI="sqlite:///"+os.path.join(BASE_DIR,'dev.db')
    DEBUG=True
    #Set up SQLAlchemy echo to record SQL statements for troubleshooting.
    SQLALCHEMY_ECHO=True

class ProdConfig(Config):
    pass

class TestConfig(Config):
    SQLALCHEMY_DATABASE_URI='sqlite:///test.db'

    # Disable SQLAlchemy echo to keep the test output from becoming cluttered.
    SQLALCHEMY_ECHO=False
    TESTING=True