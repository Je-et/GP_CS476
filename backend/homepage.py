from flask_restx import Api, Resource, fields, Namespace
from models import Items
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required
from flask import Flask, request, jsonify

homepage_ns=Namespace('home', description='homepage realated operations')

item_model=homepage_ns.model(
    'Items',
    {
        "name": fields.String(),
        "price": fields.Float(),
        "calorie": fields.Integer(),
        "vegan": fields.Boolean(),
        "glutenFree": fields.Boolean(),
    }
)

@homepage_ns.route('/items')
class Item(Resource):

    @homepage_ns.expect(item_model)
    def (self):
        data = request.get_json()