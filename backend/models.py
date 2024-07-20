from exts import db

"""
class User:
    id:int
    username:str
    email:str
    password:str

"""

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(25), nullable=False, unique=True)
    email = db.Column(db.String(60), nullable=False)
    password = db.Column(db.Text(), nullable=False)

    def __repr__(self):
        return f"<User {self.username}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

'''Need a way to pictures here below'''
class Items(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    price = db.Column(db.Float(), nullable=False)
    calorie = db.Column(db.Integer(4), nullable=False)
    vegan = db.Column(db.boolean(), nullable=False)
    glutenFree = db.Column(db.boolean(), nullable=False)
    '''try and add more attributes here'''

    def __repr__(self):
        return f"<User {self.name}>"

    def save(self):
        db.session.add(self)
        db.session.commit()