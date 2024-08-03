from flask import request
from flask_restx import Namespace, Resource, fields
from models import Recipe, Item
from exts import db


# namespace for recipes-related operations
recipes_ns = Namespace('recipes', description='Recipe operations')

# model for an item, which is part of a recipe
item_model = recipes_ns.model('Item', {
    'id': fields.Integer(readonly=True),
    'name': fields.String(required=True),
    'price': fields.Float(required=True),
    'calorie': fields.Integer(required=True),
    'vegan': fields.Boolean(required=True),
    'glutenFree': fields.Boolean(required=True),
    'discount': fields.Float(required=True),
    'picture': fields.String(),
    'sales': fields.Integer(required=True)
})


# model for a recipe with their fields

recipe_model = recipes_ns.model('Recipe', {
    'id': fields.Integer(readonly=True),
    'name': fields.String(required=True),
    'description': fields.String(),
    'is_vegan': fields.Boolean(),
    'is_gluten_free': fields.Boolean(),
    'ingredients': fields.List(fields.Nested(item_model))
})


# class to list all the recipes 
@recipes_ns.route('')
class RecipeList(Resource):
    @recipes_ns.marshal_list_with(recipe_model)
    def get(self):
        """Get all recipes"""

        # serialize recipes and return them
        return [recipe.serialize() for recipe in Recipe.query.all()]


# class for retrieving details of a specific recipe by ID
@recipes_ns.route('/<int:id>')
class RecipeResource(Resource):
    @recipes_ns.marshal_with(recipe_model)
    def get(self, id):
        """Get a specific recipe by ID"""

        # Get a specific recipe by its ID, 404 if not found
        recipe = Recipe.query.get_or_404(id)
        return recipe.serialize()


# Class to specifically search for recipes
@recipes_ns.route('/search')
class RecipeSearch(Resource):
    @recipes_ns.marshal_list_with(recipe_model)
    @recipes_ns.doc(params={'q': 'Search term', 'vegan': 'Filter for vegan recipes', 'gluten_free': 'Filter for gluten-free recipes', 'page': 'Page number', 'per_page': 'Recipes per page'})
    def get(self):
        """Search for recipes"""
        search_term = request.args.get('q', '')
        is_vegan = request.args.get('vegan', '').lower() == 'true'
        is_gluten_free = request.args.get('gluten_free', '').lower() == 'true'
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)


        # Start building the query
        query = Recipe.query


        # Apply filters based on search parameters
        if search_term:
            query = query.filter(Recipe.name.ilike(f'%{search_term}%'))
        if is_vegan:
            query = query.filter_by(is_vegan=True)
        if is_gluten_free:
            query = query.filter_by(is_gluten_free=True)

        # Paginate the query results
        paginated_recipes = query.paginate(page=page, per_page=per_page)
        return [recipe.serialize() for recipe in paginated_recipes.items]


#class to get the recipe by ingredient ID

@recipes_ns.route('/<int:id>/ingredients')
class RecipeIngredients(Resource):
    @recipes_ns.marshal_list_with(item_model)
    def get(self, id):
        """Get ingredients for a specific recipe"""

         # Fetch the recipe with the specified ID from the database
        recipe = Recipe.query.get_or_404(id)
        return [item.serialize() for item in recipe.items]
