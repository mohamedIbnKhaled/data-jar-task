from sqlalchemy import Column, Integer, Text
from .db import Base

class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    prompt = Column(Text, nullable=False)
    response_json = Column(Text, nullable=False)
