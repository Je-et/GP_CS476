from flask_restx import Namespace, Resource
from models import Item
from flask import jsonify, request, send_from_directory, current_app
import random
import logging
import os

items_ns = Namespace('items', description='Items related operations')

@items_ns.route('/')
class ItemList(Resource):
    def get(self):
        items = Item.query.all()
        return jsonify([item.serialize() for item in items])

@items_ns.route('/best-sellers')
class BestSellers(Resource):
    def get(self):
        best_sellers = Item.query.order_by(Item.sales.desc()).limit(10).all()  # Assuming you have a sales attribute
        return jsonify([{
            "id": item.id,
            "name": item.name,
            "price": item.price,
            "calorie": item.calorie,
            "vegan": item.vegan,
            "glutenFree": item.glutenFree,
            "discount": item.discount,
            "picture": item.picture
        } for item in best_sellers])

@items_ns.route('/new-arrivals')
class NewArrivals(Resource):
    def get(self):
        new_arrivals = Item.query.order_by(Item.id.desc()).limit(10).all()
        return jsonify([{
            "id": item.id,
            "name": item.name,
            "price": item.price,
            "calorie": item.calorie,
            "vegan": item.vegan,
            "glutenFree": item.glutenFree,
            "discount": item.discount,
            "picture": item.picture
        } for item in new_arrivals])
    
@items_ns.route('/<int:item_id>')
class ItemDetail(Resource):
    def get(self, item_id):
        item = Item.query.get_or_404(item_id)
        return jsonify({
            "id": item.id,
            "name": item.name,
            "price": item.price,
            "calorie": item.calorie,
            "vegan": item.vegan,
            "glutenFree": item.glutenFree,
            "discount": item.discount,
            "picture": item.picture,
            "description": item.description  # Assuming you have a description field
        })

@items_ns.route('/recommendations')
class Recommendations(Resource):
    def get(self):
        items = Item.query.all()
        recommendations = random.sample(items, min(len(items), 10))  # Get up to 10 random items
        return jsonify([{
            "id": item.id,
            "name": item.name,
            "price": item.price,
            "calorie": item.calorie,
            "vegan": item.vegan,
            "glutenFree": item.glutenFree,
            "discount": item.discount,
            "picture": item.picture
        } for item in recommendations])



@items_ns.route('/search')
class SearchItems(Resource):
    def get(self):
        query = request.args.get('q', '')
        logging.info(f"Received search query: {query}")
        items = Item.query.filter(Item.name.ilike(f'%{query}%')).all()
        result = [item.serialize() for item in items]
        logging.info(f"Returning {len(result)} results")
        return jsonify(result)

@items_ns.route('/image/<path:filename>')
class ItemImage(Resource):
    def get(self, filename):
        uploads = os.path.join(current_app.root_path, current_app.config['IMAGES_FOLDER'])
        return send_from_directory(uploads, filename)
    

@items_ns.route('/debug')
class DebugItems(Resource):
    def get(self):
        items = Item.query.all()
        return jsonify([{
            'id': item.id,
            'name': item.name,
            'picture': item.picture
        } for item in items])
    