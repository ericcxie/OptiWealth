from app import db


class UserPortfolio(db.Model):
    __tablename__ = 'users_portfolio'
    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String, nullable=False)
    user_uid = db.Column(db.Text, nullable=False,
                         unique=True)
    portfolio_data = db.Column(db.Text, nullable=False)
