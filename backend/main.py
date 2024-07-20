from flask import Flask
from flask_restx import Api
from models import User
from exts import db
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from auth import auth_ns
from config import Config
from profile import profile
from orders import orders
from profile import profile_ns
from cart import cart_ns
from checkout import checkout_ns
from orders import orders_ns


app = Flask(__name__)

app.config.from_object(Config)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///dev.db"
db.init_app(app)

migrate = Migrate(app, db)
JWTManager(app)

api = Api(app, doc='/docs')

api.add_namespace(auth_ns)
api.add_namespace(auth_ns, path='/auth')
api.add_namespace(profile_ns, path='/profile')
api.add_namespace(cart_ns, path='/cart')
api.add_namespace(checkout_ns, path='/checkout')
api.add_namespace(orders_ns, path='/orders')

@app.shell_context_processor
def make_shell_context():
    return {
        "db": db,
        "user": User
    }

if __name__ == '__main__':
    app.run(debug=True)
