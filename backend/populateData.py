import random
from exts import db
from models import User, Item
from main import create_app
from werkzeug.security import generate_password_hash

app = create_app()

def populate_database():
    with app.app_context():
        # Drop all tables and create them fresh
        db.drop_all()
        db.create_all()
        
        # Sample Users
        users = []
        for i in range(1, 16):  # Creating 15 users
            user = User(username=f'user{i}', email=f'user{i}@example.com', password=generate_password_hash('password'))
            users.append(user)
            db.session.add(user)

        # Sample Items
        items = [
            Item(name='Pepper', price=2.49, calorie=30, vegan=True, glutenFree=True, discount=10, picture='https://via.placeholder.com/100'),
            Item(name='Carrot', price=2.99, calorie=41, vegan=True, glutenFree=True, discount=15, picture='https://via.placeholder.com/100'),
            Item(name='Cauliflower', price=3.99, calorie=25, vegan=True, glutenFree=True, discount=5, picture='https://via.placeholder.com/100'),
            Item(name='Coriander Leaves', price=0.89, calorie=23, vegan=True, glutenFree=True, discount=20, picture='https://via.placeholder.com/100'),
            Item(name='Apple', price=1.49, calorie=52, vegan=True, glutenFree=True, discount=0, picture='https://via.placeholder.com/100'),
            Item(name='Banana', price=0.99, calorie=89, vegan=True, glutenFree=True, discount=0, picture='https://via.placeholder.com/100'),
            Item(name='Broccoli', price=1.69, calorie=34, vegan=True, glutenFree=True, discount=10, picture='https://via.placeholder.com/100'),
            Item(name='Spinach', price=2.29, calorie=23, vegan=True, glutenFree=True, discount=10, picture='https://via.placeholder.com/100'),
            Item(name='Potato', price=1.09, calorie=77, vegan=True, glutenFree=True, discount=5, picture='https://via.placeholder.com/100'),
            Item(name='Tomato', price=1.99, calorie=18, vegan=True, glutenFree=True, discount=0, picture='https://via.placeholder.com/100'),
            Item(name='Orange', price=1.29, calorie=47, vegan=True, glutenFree=True, discount=0, picture='https://via.placeholder.com/100'),
            Item(name='Milk', price=2.99, calorie=42, vegan=False, glutenFree=True, discount=0, picture='https://via.placeholder.com/100'),
            Item(name='Cheese', price=4.99, calorie=402, vegan=False, glutenFree=True, discount=0, picture='https://via.placeholder.com/100'),
            Item(name='Bread', price=2.49, calorie=265, vegan=False, glutenFree=False, discount=5, picture='https://via.placeholder.com/100'),
            Item(name='Eggs', price=3.99, calorie=155, vegan=False, glutenFree=True, discount=0, picture='https://via.placeholder.com/100'),
            Item(name='Chicken Breast', price=5.99, calorie=165, vegan=False, glutenFree=True, discount=10, picture='https://via.placeholder.com/100'),
            Item(name='Salmon', price=8.99, calorie=208, vegan=False, glutenFree=True, discount=0, picture='https://via.placeholder.com/100'),
            Item(name='Rice', price=1.99, calorie=130, vegan=True, glutenFree=True, discount=5, picture='https://via.placeholder.com/100'),
            Item(name='Pasta', price=1.49, calorie=157, vegan=True, glutenFree=False, discount=5, picture='https://via.placeholder.com/100'),
            Item(name='Olive Oil', price=6.99, calorie=884, vegan=True, glutenFree=True, discount=0, picture='https://via.placeholder.com/100'),
            Item(name='Almonds', price=9.99, calorie=575, vegan=True, glutenFree=True, discount=0, picture='https://via.placeholder.com/100'),
            Item(name='Yogurt', price=2.49, calorie=59, vegan=False, glutenFree=True, discount=5, picture='https://via.placeholder.com/100'),
            Item(name='Butter', price=3.49, calorie=717, vegan=False, glutenFree=True, discount=0, picture='https://via.placeholder.com/100'),
            Item(name='Strawberries', price=2.99, calorie=32, vegan=True, glutenFree=True, discount=10, picture='https://via.placeholder.com/100'),
            Item(name='Blueberries', price=3.99, calorie=57, vegan=True, glutenFree=True, discount=15, picture='https://via.placeholder.com/100'),
            Item(name='Mango', price=1.99, calorie=60, vegan=True, glutenFree=True, discount=0, picture='https://via.placeholder.com/100'),
            Item(name='Pineapple', price=2.49, calorie=50, vegan=True, glutenFree=True, discount=0, picture='https://via.placeholder.com/100'),
            Item(name='Avocado', price=1.99, calorie=160, vegan=True, glutenFree=True, discount=5, picture='https://via.placeholder.com/100'),
            Item(name='Lettuce', price=1.29, calorie=15, vegan=True, glutenFree=True, discount=0, picture='https://via.placeholder.com/100'),
            Item(name='Cucumber', price=1.49, calorie=16, vegan=True, glutenFree=True, discount=10, picture='https://via.placeholder.com/100'),
            Item(name='Zucchini', price=1.69, calorie=17, vegan=True, glutenFree=True, discount=5, picture='https://via.placeholder.com/100'),
            Item(name='Bell Pepper', price=2.49, calorie=31, vegan=True, glutenFree=True, discount=0, picture='https://via.placeholder.com/100'),
            Item(name='Grapes', price=2.99, calorie=69, vegan=True, glutenFree=True, discount=0, picture='https://via.placeholder.com/100'),
            Item(name='Watermelon', price=3.49, calorie=30, vegan=True, glutenFree=True, discount=10, picture='https://via.placeholder.com/100'),
            Item(name='Cherries', price=4.99, calorie=50, vegan=True, glutenFree=True, discount=15, picture='https://via.placeholder.com/100'),
            Item(name='Beef Steak', price=12.99, calorie=271, vegan=False, glutenFree=True, discount=5, picture='https://via.placeholder.com/100'),
            Item(name='Shrimp', price=9.99, calorie=99, vegan=False, glutenFree=True, discount=10, picture='https://via.placeholder.com/100'),
            Item(name='Tofu', price=2.49, calorie=76, vegan=True, glutenFree=True, discount=0, picture='https://via.placeholder.com/100'),
            Item(name='Tempeh', price=3.49, calorie=195, vegan=True, glutenFree=True, discount=0, picture='https://via.placeholder.com/100'),
            Item(name='Quinoa', price=4.99, calorie=120, vegan=True, glutenFree=True, discount=5, picture='https://via.placeholder.com/100'),
            Item(name='Chickpeas', price=1.49, calorie=164, vegan=True, glutenFree=True, discount=5, picture='https://via.placeholder.com/100'),
            Item(name='Black Beans', price=1.29, calorie=132, vegan=True, glutenFree=True, discount=10, picture='https://via.placeholder.com/100'),
            Item(name='Lentils', price=1.79, calorie=116, vegan=True, glutenFree=True, discount=0, picture='https://via.placeholder.com/100'),
            Item(name='Kidney Beans', price=1.39, calorie=127, vegan=True, glutenFree=True, discount=5, picture='https://via.placeholder.com/100'),
            Item(name='Peanut Butter', price=3.99, calorie=588, vegan=True, glutenFree=True, discount=0, picture='https://via.placeholder.com/100'),
            Item(name='Jam', price=2.99, calorie=240, vegan=True, glutenFree=True, discount=0, picture='https://via.placeholder.com/100'),
            Item(name='Honey', price=4.49, calorie=304, vegan=False, glutenFree=True, discount=0, picture='https://via.placeholder.com/100'),
            Item(name='Almond Milk', price=3.99, calorie=13, vegan=True, glutenFree=True, discount=5, picture='https://via.placeholder.com/100')
        ]

        for item in items:
            db.session.add(item)

        # Assign random items to users
        for user in users:
            user.items.extend(random.sample(items, 10))

        # Commit to the database
        db.session.commit()
        print("Database populated with sample data.")

if __name__ == '__main__':
    populate_database()
