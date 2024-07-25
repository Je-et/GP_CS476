from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, CartItem
from flask import jsonify, request
from exts import db

cart_ns = Namespace('cart', description='Cart related operations')

cart_item_model = cart_ns.model(
    'CartItem', {
        'itemId': fields.String(required=True, description='The ID of the item'),
        'quantity': fields.Integer(required=True, description='The quantity of the item')
    }
)

# Fetch the cart items
@cart_ns.route('/items')
class CartItems(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()
        if not user:
            return {'message': 'User not found'}, 404

        cart_items = CartItem.query.filter_by(user_id=user.id).all()
        return [item.serialize() for item in cart_items], 200

# Add item into the cart
@cart_ns.route('/add')
class AddToCart(Resource):
    @jwt_required()
    @cart_ns.expect(cart_item_model)
    def post(self):
        data = request.get_json()
        item_id = data.get('itemId')
        quantity = data.get('quantity')

        # Debugging: Log the received data
        cart_ns.logger.debug(f"Received data: item_id={item_id}, quantity={quantity}")

        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()
        if not user:
            return {'message': 'User not found'}, 404

        if not item_id or not quantity:
            return {'message': 'Item ID and quantity are required'}, 400

        new_item = CartItem(user_id=user.id, item_id=item_id, quantity=quantity)
        db.session.add(new_item)
        db.session.commit()

        return {'message': 'Item added to cart'}, 201

# Update cart item quantity
@cart_ns.route('/update')
class UpdateCartItem(Resource):
    @jwt_required()
    @cart_ns.expect(cart_item_model)
    def put(self):
        data = request.get_json()
        item_id = data.get('itemId')
        quantity = data.get('quantity')

        # Debugging: Log the received data
        cart_ns.logger.debug(f"Received data: item_id={item_id}, quantity={quantity}")

        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()
        if not user:
            return {'message': 'User not found'}, 404

        if not item_id or not quantity:
            return {'message': 'Item ID and quantity are required'}, 400

        item = CartItem.query.filter_by(user_id=user.id, item_id=item_id).first()
        if item:
            item.quantity = quantity
            db.session.commit()
            return {"message": "Cart item updated"}, 200
        return {"message": "Item not found"}, 404

# Remove item from the cart
@cart_ns.route('/remove/<string:item_id>')
class RemoveFromCart(Resource):
    @jwt_required()
    def delete(self, item_id):
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()
        if not user:
            return {'message': 'User not found'}, 404

        item = CartItem.query.filter_by(user_id=user.id, item_id=item_id).first()
        if item:
            db.session.delete(item)
            db.session.commit()

            return {"message": "Item removed from cart"}, 200
        return {"message": "Item not found"}, 404