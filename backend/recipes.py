from flask import request
from flask_restx import Namespace, Resource, fields
from models import Recipe, RecipeItem, Item
from exts import db

recipes_ns = Namespace('recipes', description='Recipe operations')

recipe_model = recipes_ns.model('Recipe', {
    'id': fields.Integer(readonly=True),
    'name': fields.String(required=True),
    'description': fields.String(),
    'is_vegan': fields.Boolean(),
    'is_plant_based': fields.Boolean(),
})

@recipes_ns.route('')
class RecipeList(Resource):
    @recipes_ns.marshal_list_with(recipe_model)
    def get(self):
        return Recipe.query.all()

@recipes_ns.route('/<int:id>')
class RecipeResource(Resource):
    @recipes_ns.marshal_with(recipe_model)
    def get(self, id):
        recipe = Recipe.query.get_or_404(id)
        return recipe.serialize()

@recipes_ns.route('/search')
class RecipeSearch(Resource):
    @recipes_ns.marshal_list_with(recipe_model)
    def get(self):
        search_term = request.args.get('q', '')
        is_vegan = request.args.get('vegan', '').lower() == 'true'
        is_plant_based = request.args.get('plant_based', '').lower() == 'true'

        query = Recipe.query

        if search_term:
            query = query.filter(Recipe.name.ilike(f'%{search_term}%'))
        if is_vegan:
            query = query.filter_by(is_vegan=True)
        if is_plant_based:
            query = query.filter_by(is_plant_based=True)

        recipes = query.all()
        return [recipe.serialize() for recipe in recipes]