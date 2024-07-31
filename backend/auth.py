from flask_restx import Namespace, Resource, fields
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token
from flask import request, jsonify, current_app
import os
from exts import db
from models import User

auth_ns = Namespace('auth', description='Authentication related operations')

signup_model = auth_ns.model(
    'Signup',
    {
        "username": fields.String(),
        "email": fields.String(),
        "password": fields.String(),
    }
)

login_model = auth_ns.model(
    'Login',
    {
        "username": fields.String(),
        "password": fields.String()
    }
)

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

@auth_ns.route('/login')
class Login(Resource):

    @auth_ns.expect(login_model)
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        db_user = User.query.filter_by(username=username).first()

        if db_user and check_password_hash(db_user.password, password):
            if db_user.is_employee or username.endswith('.emp'):
                # Employee login
                access_token = create_access_token(identity={'username': db_user.username, 'is_employee': True})
                return jsonify({"access_token": access_token, "message": "Employee login successful"})
            else:
                # Regular user login
                access_token = create_access_token(identity={'username': db_user.username, 'is_employee': False})
                return jsonify({"access_token": access_token, "message": "User login successful"})

        return jsonify({"message": "Invalid credentials"}), 401

# Create an account for employee - do this with postman
@auth_ns.route('/create_employee')
class CreateEmployee(Resource):

    @auth_ns.expect(signup_model)
    def post(self):
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username.endswith('.emp'):
            username += '.emp'

        hashed_password = generate_password_hash(password)

        new_employee = User(
            username=username,
            email=email,
            password=hashed_password,
            is_employee=True  # Set to True to indicate employee
        )

        db.session.add(new_employee)
        db.session.commit()

        return jsonify({"message": "Employee account created successfully"}), 201