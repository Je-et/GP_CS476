from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, CartItem
from flask import jsonify, request
from exts import db

cart_ns = Namespace('cart', description='Cart related operations')

cart_item_model = cart_ns.model(
    'CartItem', {
        'itemId': fields.Integer(required=True, description='The ID of the item'),
        'quantity': fields.Integer(required=True, description='The quantity of the item')
    }
)

# Fetch the cart items
@cart_ns.route('/items')
class CartItems(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        cart_ns.logger.debug(f"Current User: {current_user}")
        
        user = User.query.filter_by(username=current_user).first()
        if not user:
            cart_ns.logger.debug("User not found")
            return {'message': 'User not found'}, 404
        
        cart_items = CartItem.query.filter_by(user_id=user.id).all()
        serialized_items = [item.serialize() for item in cart_items]
        cart_ns.logger.debug(f"Serialized Cart Items for user {user.username}: {serialized_items}")
        
        return serialized_items, 200

# Add item into the cart
@cart_ns.route('/add')
class AddToCart(Resource):
    @jwt_required()
    @cart_ns.expect(cart_item_model)
    def post(self):
        try:
            data = request.get_json()
            cart_ns.logger.debug(f"Received data: {data}")
            
            item_id = data.get('itemId')
            quantity = data.get('quantity')

            cart_ns.logger.debug(f"item_id={item_id}, quantity={quantity}")

            current_user = get_jwt_identity()
            user = User.query.filter_by(username=current_user).first()
            if not user:
                cart_ns.logger.debug("User not found")
                return {'message': 'User not found'}, 404

            if not item_id or not quantity:
                cart_ns.logger.debug("Item ID and quantity are required")
                return {'message': 'Item ID and quantity are required'}, 400

            new_item = CartItem(user_id=user.id, item_id=item_id, quantity=quantity)
            db.session.add(new_item)
            db.session.commit()

            cart_ns.logger.debug("Item added to cart")
            return {'message': 'Item added to cart'}, 201
        except Exception as e:
            cart_ns.logger.error(f"Failed to add item to cart: {str(e)}")
            return {'message': 'Failed to add item to cart', 'error': str(e)}, 500

# Update cart item quantity
@cart_ns.route('/update')
class UpdateCartItem(Resource):
    @jwt_required()
    @cart_ns.expect(cart_item_model)
    def put(self):
        try:
            data = request.get_json()
            cart_ns.logger.debug(f"Received data: {data}")

            item_id = data.get('itemId')
            quantity = data.get('quantity')

            cart_ns.logger.debug(f"item_id={item_id}, quantity={quantity}")

            current_user = get_jwt_identity()
            user = User.query.filter_by(username=current_user).first()
            if not user:
                cart_ns.logger.debug("User not found") 
                return {'message': 'User not found'}, 404

            if not item_id or not quantity:
                cart_ns.logger.debug("Item ID and quantity are required")
                return {'message': 'Item ID and quantity are required'}, 400

            item = CartItem.query.filter_by(user_id=user.id, item_id=item_id).first()
            if item:
                item.quantity = quantity
                db.session.commit()
                cart_ns.logger.debug(f"Cart item updated: {item.serialize()}")
                return {"message": "Cart item updated"}, 200
            cart_ns.logger.debug("Item not found")
            return {"message": "Item not found"}, 404
        except Exception as e:
            cart_ns.logger.error(f"Failed to update cart item: {str(e)}")
            return {'message': 'Failed to update cart item', 'error': str(e)}, 500

# Remove item from the cart
@cart_ns.route('/remove/<int:item_id>')
class RemoveFromCart(Resource):
    @jwt_required()
    def delete(self, item_id):
        try:
            current_user = get_jwt_identity()
            cart_ns.logger.debug(f"Received item_id: {item_id}")
            cart_ns.logger.debug(f"Current User: {current_user}")
            user = User.query.filter_by(username=current_user).first()
            if not user:
                cart_ns.logger.debug("User not found")
                return {'message': 'User not found'}, 404

            cart_ns.logger.debug(f"Removing item with id: {item_id} for user {user.username}")

            item = CartItem.query.filter_by(user_id=user.id, item_id=item_id).first()
            if item:
                db.session.delete(item)
                db.session.commit()
                cart_ns.logger.debug("Item removed from cart")
                return {"message": "Item removed from cart"}, 200
            cart_ns.logger.debug("Item not found")
            return {"message": "Item not found"}, 404
        except Exception as e:
            cart_ns.logger.error(f"Failed to remove item from cart: {str(e)}")
            return {'message': 'Failed to remove item from cart', 'error': str(e)}, 500
