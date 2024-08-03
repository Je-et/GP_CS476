import os
from flask import Flask
from flask_restx import Api
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from exts import db
from models import User
from auth import auth_ns
from items import items_ns
from config import Config
from profile import profile_ns
from cart import cart_ns
from checkout import checkout_ns
from orders import orders_ns
from recipes import recipes_ns

def create_app():

    # creating an insatnce for flask app
    app = Flask(__name__)
    
    # from config object load all the configurations
    app.config.from_object(Config)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///dev.db"
    app.config["UPLOAD_FOLDER"] = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'static/uploads')
    app.config['JWT_SECRET_KEY'] = 'your_secret_key'
    app.config['IMAGES_FOLDER'] = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'images')

    db.init_app(app)

    # Initialize Flask-Migrate to handle database migrations
    migrate = Migrate(app, db)

    # Initialize Flask-JWT-Extended to handle JWT authentication
    jwt = JWTManager(app)
    
    # Enable CORS for the entire application
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


    # Initialize Flask-RESTX to handle API namespaces and documentation 
    api = Api(app, doc='/docs')

    # Register API namespaces with their respective paths
    api.add_namespace(auth_ns)
    api.add_namespace(items_ns, path='/items')
    api.add_namespace(auth_ns, path='/auth')
    api.add_namespace(profile_ns, path='/profile')
    api.add_namespace(cart_ns, path='/cart')
    api.add_namespace(checkout_ns, path='/checkout')
    api.add_namespace(orders_ns, path='/orders')
    api.add_namespace(recipes_ns, path='/recipes')

    return app

# Create the Flask app by calling the create_app function
app = create_app()

@app.shell_context_processor
def make_shell_context():
    return {
        "db": db,
        "User": User
    }

if __name__ == '__main__':
    app.run(debug=True)
