from flask_sqlalchemy import SQLAlchemy
from src.models.user import db
import datetime

class Satellite(db.Model):
    __tablename__ = 'satellites'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    norad_id = db.Column(db.Integer, unique=True, nullable=False)
    line1 = db.Column(db.String(70), nullable=False)
    line2 = db.Column(db.String(70), nullable=False)
    category = db.Column(db.String(50), default='Other')
    is_active = db.Column(db.Boolean, default=True)
    last_updated = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'norad_id': self.norad_id,
            'line1': self.line1,
            'line2': self.line2,
            'category': self.category,
            'is_active': self.is_active,
            'last_updated': self.last_updated.isoformat() if self.last_updated else None
        }

