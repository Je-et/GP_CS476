from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request, jsonify, send_from_directory
from models import User
from exts import db
import os

profile_ns = Namespace('profile', description='Profile related operations')

profile_model = profile_ns.model(
    'Profile', {
        'username': fields.String(),
        'profile_picture': fields.String()
    }
)

@profile_ns.route('/')
class UserProfile(Resource):

    @jwt_required()
    @profile_ns.marshal_with(profile_model)
    def get(self):
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()

        if not user:
            profile_ns.abort(404, 'User not found')

        return user

    @jwt_required()
    @profile_ns.expect(profile_model)
    def put(self):
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()

        if not user:
            profile_ns.abort(404, 'User not found')

        data = request.get_json()
        profile_picture = data.get('profile_picture')

        if profile_picture:
            user.profile_picture = profile_picture

        db.session.commit()
        return jsonify({"message": "Profile updated successfully"})

@profile_ns.route('/profile_picture/<filename>')
class ProfilePicture(Resource):
    def get(self, filename):
        return send_from_directory('static/uploads', filename)