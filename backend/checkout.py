from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, CartItem, Order, OrderItem, CheckoutItem, Item
from flask import jsonify, request
from exts import db

# Establish a namespacee for checkout related operationss

checkout_ns = Namespace('checkout', description='Checkout related operations')

# Model defined for processing the payment

payment_model = checkout_ns.model(
    'Payment', {
        'ccNumber': fields.String(required=True, description='Credit Card Number'),
        'expiry': fields.String(required=True, description='Expiry Date'),
        'ccv': fields.String(required=True, description='Security Code')
    }
)

# Defining a class(with route) that processes the payment and creates an order
@checkout_ns.route('/payment')
class ProcessPayment(Resource):
    @jwt_required()
    @checkout_ns.expect(payment_model)
    def post(self):

        # fetching the payment data from the request
        data = request.get_json()
        ccNumber = data.get('ccNumber')
        expiry = data.get('expiry')
        ccv = data.get('ccv')

        # validating the payment data if it is correct or not
        errors = {}
        if not ccNumber or len(ccNumber) != 16 or not ccNumber.isdigit():
            errors['ccNumber'] = 'Credit Card Number must be 16 digits'
        if not expiry:
            errors['expiry'] = 'Expiry date is required'
        if not ccv or not (len(ccv) == 3 or len(ccv) == 4) or not ccv.isdigit():
            errors['ccv'] = 'Security Code must be 3 or 4 digits'

        # will return errors if validation goes wrong
        if errors:
            return errors, 400

        # get the current user 
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()
        if not user:
            return {'message': 'User not found'}, 404

        # Calculate the total price for the order
        cart_items = CartItem.query.filter_by(user_id=user.id).all()
        total_price = 0
        for cart_item in cart_items:
            item = Item.query.filter_by(id=cart_item.item_id).first()
            if item is None:
                return {'message': f'Item with id {cart_item.item_id} not found'}, 404
            total_price += item.price * cart_item.quantity

        # Create a new order
        new_order = Order(
            user_id=user.id,
            total_price=total_price,
            status='Pending'
        )
        db.session.add(new_order)
        db.session.commit()

        # Add items from the cart to the order
        for cart_item in cart_items:
            item = Item.query.filter_by(id=cart_item.item_id).first()
            if item:
                order_item = OrderItem(
                    order_id=new_order.id,
                    item_id=item.id,
                    quantity=cart_item.quantity,
                    total_price=item.price * cart_item.quantity
                )
                db.session.add(order_item)

        db.session.commit()

        # Clear the cart of the user
        CartItem.query.filter_by(user_id=user.id).delete()
        db.session.commit()

        # Save the checkout details
        new_checkout_item = CheckoutItem(ccNumber=ccNumber, expiry=expiry, ccv=ccv)
        new_checkout_item.save()

        return {"message": "Success! Payment has been received."}, 200

# Retrieve checkout items
@checkout_ns.route('/items')
class CheckoutItems(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()
        if not user:
            return {'message': 'User not found'}, 404

    
        # query all the orders for the current user
        orders = Order.query.filter_by(user_id=user.id).all()
        result = []
        for order in orders:
            order_data = {
                'id': order.id,
                'total_price': order.total_price,
                'status': order.status,
                'items': []
            }


            # query all the items for the current order
            order_items = OrderItem.query.filter_by(order_id=order.id).all()
            for order_item in order_items:
                item = Item.query.filter_by(id=order_item.item_id).first()
                if item:
                    order_data['items'].append({
                        'id': item.id,
                        'name': item.name,
                        'price': item.price,
                        'quantity': order_item.quantity,
                        'total_price': order_item.total_price
                    })
            result.append(order_data)

        return result, 200