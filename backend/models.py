from exts import db

# Association table for many-to-many relationship between User and Items
previous_purchases = db.Table('previous_purchases',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('item_id', db.Integer, db.ForeignKey('items.id'), primary_key=True)
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(25), nullable=False, unique=True)
    email = db.Column(db.String(60), nullable=False)
    password = db.Column(db.Text(), nullable=False)
    profile_picture = db.Column(db.String(200), nullable=True)
    items = db.relationship('Items', secondary=previous_purchases, lazy='subquery',
        backref=db.backref('users', lazy=True))

    def __repr__(self):
        return f"<User {self.username}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

class Items(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float(), nullable=False)
    calorie = db.Column(db.Integer(), nullable=False)
    vegan = db.Column(db.Boolean(), nullable=False)
    glutenFree = db.Column(db.Boolean(), nullable=False)
    discount = db.Column(db.Float(), nullable=False, default=0.0)

    def __repr__(self):
        return f"<Item {self.name}>"

    def save(self):
        db.session.add(self)
        db.session.commit()


class CartItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    item = db.relationship('Items', backref=db.backref('cart_items', lazy=True))

    def __repr__(self):
        return f"<CartItem {self.item.name} x {self.quantity}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def serialize(self):
        return {
            'id': self.id,
            'item_id': self.item_id,
            'quantity': self.quantity,
            'item': self.item.serialize()
        }

class CheckoutItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ccNumber = db.Column(db.String(16), nullable=False)
    expiry = db.Column(db.String(5), nullable=False)
    ccv = db.Column(db.String(4), nullable=False)

    def __repr__(self):
        return f"<CheckoutItem {self.id}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def serialize(self):
        return {
            'id': self.id,
            'ccNumber': self.ccNumber,
            'expiry': self.expiry,
            'ccv': self.ccv
        }

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), nullable=False)

    user = db.relationship('User', backref=db.backref('orders', lazy=True))
    item = db.relationship('Items', backref=db.backref('orders', lazy=True))

    def __repr__(self):
        return f"<Order {self.id} by {self.user.username}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'item_id': self.item_id,
            'quantity': self.quantity,
            'total_price': self.total_price,
            'status': self.status,
            'user': self.user.serialize(),
            'item': self.item.serialize()
        }
