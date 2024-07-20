from flask_restx import Namespace, Resource, fields
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, Order, Item
from exts import db

orders_ns = Namespace('orders', description='Order related operations')

order_model = orders_ns.model(
    'Order', {
        'order_id': fields.String(),
        'item_name': fields.String(),
        'quantity': fields.Integer(),
        'total_price': fields.Float(),
        'status': fields.String()
    }
)

buy_again_model = orders_ns.model(
    'BuyAgain', {
        'order_id': fields.String(required=True, description='Order ID')
    }
)

# Retrieve the current orders of the authenticated user
@orders_ns.route('/')
class UserOrders(Resource):
    @jwt_required()
    @orders_ns.marshal_list_with(order_model)
    def get(self):
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()
        if not user:
            orders_ns.abort(404, 'User not found')

        orders = Order.query.filter_by(user_id=user.id, status='Pending').all()
        return orders, 200

# Retrieve the order history of the authenticated user
@orders_ns.route('/history')
class UserOrderHistory(Resource):
    @jwt_required()
    @orders_ns.marshal_list_with(order_model)
    def get(self):
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()
        if not user:
            orders_ns.abort(404, 'User not found')

        orders = Order.query.filter_by(user_id=user.id).all()
        return orders, 200

# For this one, To put an item back into the cart as part of the buy_again 
# functionality, please explicitly update the frontend or the jsx file of cart.jsx
# to add add an item back into the cart after calling this endpoint.
# -------------------------------------------------------------------------------
# Buy an item again based on a previous order
@orders_ns.route('/buy_again')
class BuyAgain(Resource):
    @jwt_required()
    @orders_ns.expect(buy_again_model)
    def post(self):
        data = request.get_json()
        order_id = data.get('order_id')

        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()
        if not user:
            orders_ns.abort(404, 'User not found')

        order = Order.query.filter_by(id=order_id, user_id=user.id).first()
        if not order:
            orders_ns.abort(404, 'Order not found')

        new_order = Order(
            user_id=user.id,
            item_id=order.item_id,
            quantity=order.quantity,
            total_price=order.item.price * order.quantity,
            status='Pending'
        )
        new_order.save()

        return {
            'order_id': new_order.id,
            'item_name': new_order.item.name,
            'quantity': new_order.quantity,
            'total_price': new_order.total_price,
            'status': new_order.status
        }, 201

# Cancel an existing order
@orders_ns.route('/cancel')
class CancelOrder(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        order_id = data.get('order_id')

        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()
        if not user:
            orders_ns.abort(404, 'User not found')

        order = Order.query.filter_by(id=order_id, user_id=user.id).first()
        if not order:
            orders_ns.abort(404, 'Order not found')

        if order.status == 'Pending':
            order.status = 'Cancelled'
            db.session.commit()
            return {'message': 'Order cancelled successfully'}, 200
        else:
            return {'message': 'Order unable to be cancelled'}, 400