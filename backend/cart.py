from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, CartItem
from flask import Blueprint, jsonify, request
from exts import db

cart_ns = Namespace('cart', description='Cart related operations')

cart_item_model = cart_ns.model(
    'CartItem', {
        'itemId': fields.String(),
        'quantity': fields.Integer()
    }
)

# Fetch the cart items
@cart_ns.route('/items')
class CartItems(Resource):
    def get(self):
        cart_items = CartItem.query.all()
        
        return cart_items

# Add item into the cart
@cart_ns.route('/add')
class AddToCart(Resource):
    @cart_ns.expect(cart_item_model)
    def post(self):
        data = request.get_json()
        item_id = data.get('itemId')
        quantity = data.get('quantity')

        new_item = CartItem(item_id=item_id, quantity=quantity)
        new_item.save()

        return {'message': 'Item added to cart'}, 201

# Update cart item quantity
@cart_ns.route('/update')
class UpdateCartItem(Resource):
    @cart_ns.expect(cart_item_model)
    def put(self):
        data = request.get_json()
        item_id = data.get('itemId')
        quantity = data.get('quantity')

        item = CartItem.query.filter_by(item_id=item_id).first()
        if item:
            item.quantity = quantity
            db.session.commit()

        return {"message": "Cart item updated"}, 200

# Remove item from the cart
@cart_ns.route('/remove/<string:item_id>')
class RemoveFromCart(Resource):
    def delete(self, item_id):
        item = CartItem.query.filter_by(item_id=item_id).first()
        if item:
            db.session.delete(item)
            db.session.commit()

            return {"message": "Item removed from cart"}, 200
        return {"message": "Item not found"}, 404
