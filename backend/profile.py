from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User

profile_ns = Namespace('profile', description='Profile related operations')

profile_model = profile_ns.model(
    'Profile', {
        'username': fields.String(),
        'profile_picture': fields.String()
    }
)

# Returns the username and profile image of the user
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
