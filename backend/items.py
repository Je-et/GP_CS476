from flask_restx import Namespace, Resource
from models import Items, User
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import jsonify
import random

items_ns = Namespace('items', description='Items related operations')

@items_ns.route('/')
class ItemList(Resource):
    def get(self):
        items = Items.query.all()
        return jsonify([{
            "id": item.id,
            "name": item.name,
            "price": item.price,
            "calorie": item.calorie,
            "vegan": item.vegan,
            "glutenFree": item.glutenFree,
            "discount": item.discount
        } for item in items])

@items_ns.route('/previous')
class PreviousItemList(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found"}), 404

        previous_items = user.items
        items_list = [{
            "id": item.id,
            "name": item.name,
            "price": item.price,
            "calorie": item.calorie,
            "vegan": item.vegan,
            "glutenFree": item.glutenFree,
            "discount": item.discount
        } for item in previous_items]
        return jsonify(items_list)

@items_ns.route('/recommendations')
class Recommendations(Resource):
    def get(self):
        items = Items.query.all()
        recommendations = random.sample(items, min(len(items), 10))  # Get up to 10 random items
        return jsonify([{
            "id": item.id,
            "name": item.name,
            "price": item.price,
            "calorie": item.calorie,
            "vegan": item.vegan,
            "glutenFree": item.glutenFree,
            "discount": item.discount
        } for item in recommendations])
