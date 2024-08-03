from exts import db

# Association table for many-to-many relationship between User and Items
previous_purchases = db.Table('previous_purchases',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('item_id', db.Integer, db.ForeignKey('item.id'), primary_key=True)
)


# User model represents a user in the application
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(25), nullable=False, unique=True)
    email = db.Column(db.String(60), nullable=False)
    password = db.Column(db.Text(), nullable=False)
    profile_picture = db.Column(db.String(120), nullable=True)
    items = db.relationship('Item', secondary=previous_purchases, lazy='subquery',
        backref=db.backref('users', lazy=True))

    def __repr__(self):
        return f"<User {self.username}>"

    def save(self):
        # Save the current user instance to the database
        db.session.add(self)
        db.session.commit()

    def serialize(self):
         # Serialize the user instance 
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'profile_picture': self.profile_picture
        }

# Item model represents an item in the application
class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    price = db.Column(db.Float(), nullable=False)
    calorie = db.Column(db.Integer, nullable=False)
    vegan = db.Column(db.Boolean, nullable=False)
    glutenFree = db.Column(db.Boolean, nullable=False)
    discount = db.Column(db.Float(), nullable=False, default=0.0)
    picture = db.Column(db.String(120), nullable=True)
    sales = db.Column(db.Integer, nullable=False, default=0)
    description = db.Column(db.Text, nullable=True)

    def __repr__(self):
        return f"<Item {self.name}>"

    def save(self):
        # Save the current item instance to the database
        db.session.add(self)
        db.session.commit()

    def serialize(self):

         # Serialize the item instance
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'calorie': self.calorie,
            'vegan': self.vegan,
            'glutenFree': self.glutenFree,
            'discount': self.discount,
            'picture': f"/items/image/{self.picture}" if self.picture else None,
            'sales': self.sales
        }

# CartItem model represents an item in the user's cart
class CartItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey('item.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    user = db.relationship('User', backref=db.backref('cart_items', lazy=True))
    item = db.relationship('Item', backref=db.backref('cart_items', lazy=True))

    def __repr__(self):
        return f"<CartItem {self.item.name} x {self.quantity}>"

    def save(self):

        # Save the current cart item instance to the database
        db.session.add(self)
        db.session.commit()

    def serialize(self):

         # Serialize the cart item instance
        return {
            'id': self.id,
            'user_id': self.user_id,
            'item_id': self.item_id,
            'quantity': self.quantity,
            'item': self.item.serialize() if self.item else None
        }

# CheckoutItem model represents a checkout transaction
class CheckoutItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ccNumber = db.Column(db.String(16), nullable=False)
    expiry = db.Column(db.String(5), nullable=False)
    ccv = db.Column(db.String(4), nullable=False)

    def __repr__(self):
        return f"<CheckoutItem {self.id}>"

    def save(self):
        # Save the current checkout item instance to the database
        db.session.add(self)
        db.session.commit()

    def serialize(self):
        # Serialize the checkout item instance into a dictionary format
        return {
            'id': self.id,
            'ccNumber': self.ccNumber,
            'expiry': self.expiry,
            'ccv': self.ccv
        }

# Order model represents an order placed by a user
class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(20), nullable=False)
    total_price = db.Column(db.Float(), nullable=False)

    user = db.relationship('User', backref=db.backref('orders', lazy=True))

    def __repr__(self):
        return f"<Order {self.id} by {self.user.username}>"

    def save(self):
        # Save the current order instance to the database
        db.session.add(self)
        db.session.commit()

    def serialize(self):
        # Serialize the order instance into a dictionary format
        return {
            'id': self.id,
            'user_id': self.user_id,
            'status': self.status,
            'total_price': self.total_price,
            'user': {
                'username': self.user.username
            }
        }

# OrderItem model represents an item in an order
class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey('item.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    total_price = db.Column(db.Float(), nullable=False)

    order = db.relationship('Order', backref=db.backref('order_items', lazy=True))
    item = db.relationship('Item', backref=db.backref('order_items', lazy=True))

    def __repr__(self):
        return f"<OrderItem {self.item.name} x {self.quantity}>"

    def save(self):
        # Save the current order item instance to the database
        db.session.add(self)
        db.session.commit()

    def serialize(self):
        # Serialize the order item instance into a dictionary format
        return {
            'id': self.id,
            'order_id': self.order_id,
            'item_id': self.item_id,
            'quantity': self.quantity,
            'total_price': self.total_price,
            'item': self.item.serialize() if self.item else None
        }

# Recipe model represents a recipe that includes multiple items
class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    is_vegan = db.Column(db.Boolean, default=False)
    is_gluten_free = db.Column(db.Boolean, default=False)
    items = db.relationship('Item', secondary='recipe_item', lazy='subquery',
                            backref=db.backref('recipes', lazy=True))

    def serialize(self):
        # Serialize the recipe instance
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'is_vegan': self.is_vegan,
            'is_gluten_free': self.is_gluten_free,
            'ingredients': [item.serialize() for item in self.items]
        }

# Association table for many-to-many relationship between Recipe and Item
recipe_item = db.Table('recipe_item',
    db.Column('recipe_id', db.Integer, db.ForeignKey('recipe.id'), primary_key=True),
    db.Column('item_id', db.Integer, db.ForeignKey('item.id'), primary_key=True)
)