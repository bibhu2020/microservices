from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class TodoModel(Base):
    __tablename__ = 'todos'
    id = Column(Integer, primary_key=True)
    task = Column(String(255))
    done = Column(Boolean, default=False)
