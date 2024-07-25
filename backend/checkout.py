from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User
from flask import Blueprint, jsonify, request
from models import CheckoutItem
from exts import db

checkout_ns = Namespace('checkout', description='Checkout related operations')

payment_model = checkout_ns.model(
    'Payment', {
        'ccNumber': fields.String(required=True, description='Credit Card Number'),
        'expiry': fields.String(required=True, description='Expiry Date'),
        'ccv': fields.String(required=True, description='Security Code')
    }
)

# Processes the payment
@checkout_ns.route('/payment')
class ProcessPayment(Resource):
    @checkout_ns.expect(payment_model)
    def post(self):
        data = request.get_json()
        ccNumber = data.get('ccNumber')
        expiry = data.get('expiry')
        ccv = data.get('ccv')

        errors = {}
        if not ccNumber or len(ccNumber) != 16 or not ccNumber.isdigit():
            errors['ccNumber'] = 'Credit Card Number must be 16 digits'
        if not expiry:
            errors['expiry'] = 'Expiry date is required'
        if not ccv or not (len(ccv) == 3 or len(ccv) == 4) or not ccv.isdigit():
            errors['ccv'] = 'Security Code must be 3 or 4 digits'

        if errors:
            return errors, 400

        # new_checkout_item = CheckoutItem(ccNumber=ccNumber, expiry=expiry, ccv=ccv)
        # new_checkout_item.save()

        return {"message": "Success! Payment received."}, 200

# Retrieve checkout items, use to show orders in profile
# or for API recommendations
@checkout_ns.route('/checkoutItems')
class CheckoutItems(Resource):
    def get(self):
        checkout_items = CheckoutItem.query.all()
        return [item.serialize() for item in checkout_items], 200
