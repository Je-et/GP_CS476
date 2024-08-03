from flask_restx import Namespace, Resource, fields
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token
from flask import request, jsonify, current_app
import os
from exts import db
from models import User

# Establish a namespace for authentication of the user 

auth_ns = Namespace('auth', description='Authentication related operations')

#Model for validating signup input
signup_model = auth_ns.model(
    'Signup',
    {
        "username": fields.String(),
        "email": fields.String(),
        "password": fields.String(),
    }
)

#Model for validating login input

login_model = auth_ns.model(
    'Login',
    {
        "username": fields.String(),
        "password": fields.String()
    }
)

#created a route for user signup
@auth_ns.route('/signup')
class Signup(Resource):

    @auth_ns.expect(signup_model)
    def post(self):
        data = request.form

        # Check if user already exists
        username = data.get('username')
        db_user = User.query.filter_by(username=username).first()

        if db_user is not None:
            return jsonify({"message": f"User with username {username} already exists"})

        # Handle profile picture upload
        profile_picture = request.files.get('profilePicture')
        if profile_picture:
            profile_picture_dir = current_app.config['UPLOAD_FOLDER']
            if not os.path.exists(profile_picture_dir):
                os.makedirs(profile_picture_dir)

            # Save only the filename
            profile_picture_filename = profile_picture.filename
            profile_picture_path = os.path.join(profile_picture_dir, profile_picture_filename)
            profile_picture.save(profile_picture_path)
        else:
            return jsonify({"message": "Profile picture is required!"})

        # Create new user if unique
        new_user = User(
            username=data.get('username'),
            email=data.get('email'),
            password=generate_password_hash(data.get('password')),
            profile_picture=profile_picture_filename  # Save only the filename
        )
        new_user.save()

        return jsonify({"message": "User created successfully"})


#created a route for user login
@auth_ns.route('/login')
class Login(Resource):

    @auth_ns.expect(login_model)
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        # Check if the user exists and password is correct
        db_user = User.query.filter_by(username=username).first()

        if db_user and check_password_hash(db_user.password, password):
            # Generate tokens for JWT for the user
            access_token = create_access_token(identity=db_user.username)
            refresh_token = create_refresh_token(identity=db_user.username)

            return jsonify(
                {"access_token": access_token, "refresh_token": refresh_token}
            )

        return jsonify({"message": "Invalid credentials"})