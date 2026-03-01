import datetime
from sqlalchemy import Column, Integer, String, Enum, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    college = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    availability = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    skills = relationship("UserSkill", back_populates="user", cascade="all, delete-orphan")

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

    users = relationship("UserSkill", back_populates="skill")

class UserSkill(Base):
    __tablename__ = "user_skills"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    skill_id = Column(Integer, ForeignKey("skills.id"))
    type = Column(Enum("know", "learn", name="skill_type"))
    level = Column(Enum("Beginner", "Intermediate", "Advanced", name="skill_level"))

    user = relationship("User", back_populates="skills")
    skill = relationship("Skill", back_populates="users")
