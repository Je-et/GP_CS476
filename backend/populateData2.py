from main import create_app, db
from models import Recipe, RecipeItem, Item

def populate_database():
    app = create_app()
    with app.app_context():
        # Create some items
        items = [
            Item(name="Lettuce", price=2, calorie=5, vegan=True, glutenFree=True),
            Item(name="Tomatoes", price=3, calorie=22, vegan=True, glutenFree=True),
            Item(name="Cucumbers", price=1.5, calorie=8, vegan=True, glutenFree=True),
            Item(name="Olive Oil", price=7, calorie=884, vegan=True, glutenFree=True),
            Item(name="Chicken", price=5, calorie=239, vegan=False, glutenFree=True),
            Item(name="Carrots", price=1, calorie=41, vegan=True, glutenFree=True),
            Item(name="Onions", price=0.5, calorie=40, vegan=True, glutenFree=True),
            Item(name="Garlic", price=0.2, calorie=4, vegan=True, glutenFree=True),
            Item(name="Pasta", price=2, calorie=131, vegan=True, glutenFree=False),
            Item(name="Tomato Sauce", price=3, calorie=29, vegan=True, glutenFree=True),
            Item(name="Basil", price=1.5, calorie=1, vegan=True, glutenFree=True),
            Item(name="Parmesan", price=4, calorie=431, vegan=False, glutenFree=True),
        ]

        for item in items:
            db.session.add(item)
        db.session.commit()

        # Create some recipes
        recipes = [
            Recipe(name="Vegan Salad", description="A fresh and healthy vegan salad", is_vegan=True, is_plant_based=True),
            Recipe(name="Chicken Soup", description="A comforting chicken soup", is_vegan=False, is_plant_based=False),
            Recipe(name="Pasta", description="A classic pasta dish", is_vegan=False, is_plant_based=False),
        ]

        for recipe in recipes:
            db.session.add(recipe)
        db.session.commit()

        # Add ingredients to recipes
        recipe_items = [
            RecipeItem(recipe_id=1, item_id=1, quantity=1),  # Lettuce for Vegan Salad
            RecipeItem(recipe_id=1, item_id=2, quantity=2),  # Tomatoes for Vegan Salad
            RecipeItem(recipe_id=1, item_id=3, quantity=1),  # Cucumbers for Vegan Salad
            RecipeItem(recipe_id=1, item_id=4, quantity=0.25),  # Olive Oil for Vegan Salad

            RecipeItem(recipe_id=2, item_id=5, quantity=0.5),  # Chicken for Chicken Soup
            RecipeItem(recipe_id=2, item_id=6, quantity=2),  # Carrots for Chicken Soup
            RecipeItem(recipe_id=2, item_id=7, quantity=1),  # Onions for Chicken Soup
            RecipeItem(recipe_id=2, item_id=8, quantity=2),  # Garlic for Chicken Soup

            RecipeItem(recipe_id=3, item_id=9, quantity=1),  # Pasta for Pasta dish
            RecipeItem(recipe_id=3, item_id=10, quantity=0.5),  # Tomato Sauce for Pasta dish
            RecipeItem(recipe_id=3, item_id=11, quantity=0.25),  # Basil for Pasta dish
            RecipeItem(recipe_id=3, item_id=12, quantity=0.25),  # Parmesan for Pasta dish
        ]

        for recipe_item in recipe_items:
            db.session.add(recipe_item)
        db.session.commit()

        print("Database populated successfully!")

if __name__ == "__main__":
    populate_database()