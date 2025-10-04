from sqlalchemy import Column, Integer, String, Numeric
from sqlalchemy.orm import relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    experience_points = Column(Numeric, default=0)
    user_type = Column(String, nullable=False)
    gender = Column(String, nullable=True)
