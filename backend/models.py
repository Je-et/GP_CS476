from exts import db

# Association table for many-to-many relationship between User and Items
previous_purchases = db.Table('previous_purchases',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('item_id', db.Integer, db.ForeignKey('item.id'), primary_key=True)
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(25), nullable=False, unique=True)
    email = db.Column(db.String(60), nullable=False)
    password = db.Column(db.Text(), nullable=False)
    profile_picture = db.Column(db.String(120), nullable=True)

    def __repr__(self):
        return f"<User {self.username}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'profile_picture': self.profile_picture
        }

'''Need a way to pictures here below'''
class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float(), nullable=False)
    calorie = db.Column(db.Integer, nullable=False)
    vegan = db.Column(db.Boolean, nullable=False)
    glutenFree = db.Column(db.Boolean, nullable=False)
    '''try and add more attributes here'''
    
    def __repr__(self):
        return f"<Item {self.name}>"

    def save(self):
        db.session.add(self)
        db.session.commit()


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
        db.session.add(self)
        db.session.commit()

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'item_id': self.item_id,
            'quantity': self.quantity,
            'item': self.item.serialize() if self.item else None
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
    status = db.Column(db.String(20), nullable=False)
    total_price = db.Column(db.Float(), nullable=False)

    user = db.relationship('User', backref=db.backref('orders', lazy=True))

    def __repr__(self):
        return f"<Order {self.id} by {self.user.username}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'status': self.status,
            'total_price': self.total_price,
            'user': self.user.serialize()
        }

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
        db.session.add(self)
        db.session.commit()

    def serialize(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'item_id': self.item_id,
            'quantity': self.quantity,
            'total_price': self.total_price,
            'item': self.item.serialize() if self.item else None
        }
