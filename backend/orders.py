from flask_restx import Namespace, Resource, fields
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, Order, OrderItem, Item, CartItem
from exts import db

#namespace for order-related operations
orders_ns = Namespace('orders', description='Order related operations')


# Define the model for an item in an order
item_model = orders_ns.model(
    'Item', {
        'item_name': fields.String(),
        'quantity': fields.Integer(),
        'total_price': fields.Float(),
        'picture' : fields.String(),
    }
)

# model for an order with their fields
order_model = orders_ns.model(
    'Order', {
        'order_id': fields.Integer(),
        'items': fields.List(fields.Nested(item_model)),
        'total_price': fields.Float(),
        'status': fields.String()
    }
)

# model for the buy again request
buy_again_model = orders_ns.model(
    'BuyAgain', {
        'order_id': fields.Integer(required=True, description='Order ID')
    }
)

# Retrieve the current orders of the authenticated user
@orders_ns.route('/')
class UserOrders(Resource):
    @jwt_required()
    @orders_ns.marshal_list_with(order_model)
    def get(self):

        #get current user
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()
        if not user:
            orders_ns.abort(404, 'User not found')

        # retrieve user's pending orders
        orders = Order.query.filter_by(user_id=user.id, status='Pending').all()
        orders_data = []
        for order in orders:
            order_items = OrderItem.query.filter_by(order_id=order.id).all()
            items_data = []
            for order_item in order_items:
                item = Item.query.get(order_item.item_id)
                items_data.append({
                    'item_name': item.name,
                    'quantity': order_item.quantity,
                    'total_price': order_item.total_price,
                    'picture' : item.picture
                })
            orders_data.append({
                'order_id': order.id,
                'items': items_data,
                'total_price': order.total_price,
                'status': order.status
            })
        return orders_data, 200

# Retrieve the order history of the authenticated user
@orders_ns.route('/history')
class UserOrderHistory(Resource):
    @jwt_required()
    @orders_ns.marshal_list_with(order_model)
    def get(self):

        #get the current user
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()
        if not user:
            orders_ns.abort(404, 'User not found')

        # retrieve all orders
        orders = Order.query.filter_by(user_id=user.id).all()
        orders_data = []
        for order in orders:
            order_items = OrderItem.query.filter_by(order_id=order.id).all()
            items_data = []
            for order_item in order_items:
                item = Item.query.get(order_item.item_id)
                items_data.append({
                    'item_name': item.name,
                    'quantity': order_item.quantity,
                    'total_price': order_item.total_price,
                    'picture' : item.picture
                })
            orders_data.append({
                'order_id': order.id,
                'items': items_data,
                'total_price': order.total_price,
                'status': order.status
            })
        return orders_data, 200

# Buy an item again based on a previous order
@orders_ns.route('/buy_again')
class BuyAgain(Resource):
    @jwt_required()
    @orders_ns.expect(buy_again_model)
    def post(self):

        # get order ID from request
        data = request.get_json()
        order_id = data.get('order_id')

        # get current user
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()
        if not user:
            orders_ns.abort(404, 'User not found')

        # Retrieve the order and associated items
        order = Order.query.filter_by(id=order_id, user_id=user.id).first()
        if not order:
            orders_ns.abort(404, 'Order not found')

        order_items = OrderItem.query.filter_by(order_id=order_id).all()
        if not order_items:
            orders_ns.abort(404, 'Order items not found')

        # Add items to the cart
        for order_item in order_items:
            # Check if the item already exists in the cart
            existing_cart_item = CartItem.query.filter_by(
                user_id=user.id,
                item_id=order_item.item_id
            ).first()

            if existing_cart_item:
                # Update the quantity if item already exists
                existing_cart_item.quantity += order_item.quantity
                existing_cart_item.total_price = existing_cart_item.quantity * Item.query.get(order_item.item_id).price
            else:
                # Add new item to the cart
                new_cart_item = CartItem(
                    user_id=user.id,
                    item_id=order_item.item_id,
                    quantity=order_item.quantity,
                )
                db.session.add(new_cart_item)

        db.session.commit()

        return {'message': 'Items added to cart successfully'}, 201

# Cancel an existing order
@orders_ns.route('/cancel')
class CancelOrder(Resource):
    @jwt_required()
    def post(self):

        # get order ID from request
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
        
# Retrieve all customer orders for employees
@orders_ns.route('/employee/orders')
class EmployeeOrders(Resource):
    @jwt_required()
    @orders_ns.marshal_list_with(order_model)
    def get(self):
        orders = Order.query.all()
        orders_data = []
        for order in orders:
            order_items = OrderItem.query.filter_by(order_id=order.id).all()
            items_data = []
            for order_item in order_items:
                item = Item.query.get(order_item.item_id)
                items_data.append({
                    'item_name': item.name,
                    'quantity': order_item.quantity,
                    'total_price': order_item.total_price,
                    'picture' : item.picture
                })
            orders_data.append({
                'order_id': order.id,
                'items': items_data,
                'total_price': order.total_price,
                'status': order.status
            })
        return orders_data, 200
    
@orders_ns.route('/employee/orders/accept')
class AcceptOrder(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        order_id = data.get('order_id')

        # get order
        order = Order.query.filter_by(id=order_id).first()
        if not order:
            orders_ns.abort(404, 'Order not found')

        # Process the order if it is still pending
        if order.status == 'Pending':
            order.status = 'Processed'
            db.session.commit()
            return {'message': 'Order processed successfully'}, 200
        else:
            return {'message': 'Order already processed or unavailable'}, 400
        

 # cancel order by employees
@orders_ns.route('/employee/orders/cancel')
class CancelOrder(Resource):
    @jwt_required()
    def post(self):

        # get order ID from request
        data = request.get_json()
        order_id = data.get('order_id')

        # retrieve the order
        order = Order.query.filter_by(id=order_id).first()
        if not order:
            orders_ns.abort(404, 'Order not found')


         # Cancel the order if it is still pending
        if order.status == 'Pending':
            order.status = 'Cancelled'
            db.session.commit()
            return {'message': 'Order cancelled successfully'}, 200
        else:
            return {'message': 'Order unable to be cancelled'}, 400


# retrieve the order history for employees
@orders_ns.route('/employee/orders/history')
class EmployeeOrderHistory(Resource):
    @jwt_required() 
    @orders_ns.marshal_list_with(order_model)
    def get(self):

        # Retrieve all cancelled or processed orders
        orders = Order.query.filter(Order.status.in_(['Cancelled', 'Processed'])).all()
        orders_data = []
        for order in orders:
            order_items = OrderItem.query.filter_by(order_id=order.id).all()
            items_data = []
            for order_item in order_items:
                item = Item.query.get(order_item.item_id)
                items_data.append({
                    'item_name': item.name,
                    'quantity': order_item.quantity,
                    'total_price': order_item.total_price,
                    'picture': item.picture
                })
            orders_data.append({
                'order_id': order.id,
                'user': {
                    'username': order.user.username,
                    'user_id': order.user.id
                },
                'items': items_data,
                'total_price': order.total_price,
                'status': order.status
            })
        return orders_data, 200