from flask_restx import Namespace, Resource
from models import Item
from flask import jsonify, request, send_from_directory, current_app
import random
import logging
import os

# Establish a namespace for Items related operations

items_ns = Namespace('items', description='Items related operations')

# Define a class for listing all items
@items_ns.route('/')
class ItemList(Resource):
    def get(self):
         # Retrieve all items from the database
        items = Item.query.all()

        #return itemlist and serialize
        return jsonify([item.serialize() for item in items])


# A class defined for a list of bet-selling items
@items_ns.route('/best-sellers')
class BestSellers(Resource):
    def get(self):
        best_sellers = Item.query.order_by(Item.sales.desc()).limit(10).all() 
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


# class for list of new arrivals in the store
@items_ns.route('/new-arrivals')
class NewArrivals(Resource):
    def get(self):

        #retrieve item based on their ids
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


# class for retrieving details of a specific item by ID
@items_ns.route('/<int:item_id>')
class ItemDetail(Resource):
    def get(self, item_id):

        #retrieve the items with the given ids
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
            "description": item.description 
        })


# Recommendations class for recommending items on home page of the website
@items_ns.route('/recommendations')
class Recommendations(Resource):
    def get(self):

        # from database retrieve all items
        items = Item.query.all()
        recommendations = random.sample(items, min(len(items), 10))  
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


#searching the items by name 
@items_ns.route('/search')
class SearchItems(Resource):
    def get(self):

        # from request arguments get the search query
        query = request.args.get('q', '')
        logging.info(f"Received search query: {query}")
        items = Item.query.filter(Item.name.ilike(f'%{query}%')).all()
        result = [item.serialize() for item in items]
        logging.info(f"Returning {len(result)} results")
        return jsonify(result)


#serving item images
@items_ns.route('/image/<path:filename>')
class ItemImage(Resource):

    # Get the path to the directory where images are stored
    def get(self, filename):
        uploads = os.path.join(current_app.root_path, current_app.config['IMAGES_FOLDER'])
        return send_from_directory(uploads, filename)
    

# debugging, listing minimal item information
@items_ns.route('/debug')
class DebugItems(Resource):
    def get(self):

        # retrieve all items from database
        items = Item.query.all()
        return jsonify([{
            'id': item.id,
            'name': item.name,
            'picture': item.picture
        } for item in items])
    