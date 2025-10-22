from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, Table, DateTime
from sqlalchemy.orm import relationship
from .db import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    profile = relationship("Profile", uselist=False, back_populates="user")

class Profile(Base):
    __tablename__ = "profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    display_name = Column(String, index=True)
    bio = Column(Text, nullable=True)
    avatar_path = Column(String, nullable=True)
    interests = relationship("Interest", back_populates="profile", cascade="all, delete-orphan")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    user = relationship("User", back_populates="profile")


class Interest(Base):
    __tablename__ = "interests"
    id = Column(Integer, primary_key=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=False, index=True)
    name = Column(String, nullable=False, index=True)

    profile = relationship("Profile", back_populates="interests")

class Like(Base):
    __tablename__ = "likes"
    id = Column(Integer, primary_key=True)
    from_profile = Column(Integer, ForeignKey("profiles.id"))
    to_profile = Column(Integer, ForeignKey("profiles.id"))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True)
    chat_id = Column(String, index=True)
    from_profile = Column(Integer, ForeignKey("profiles.id"))
    to_profile = Column(Integer, ForeignKey("profiles.id"))
    text = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
