from pydantic import BaseModel, EmailStr, Field
import datetime

class SkillBase(BaseModel):
    name: str

class SkillCreate(SkillBase):
    pass

class Skill(SkillBase):
    id: int
    
    model_config = {"from_attributes": True}

class UserSkillBase(BaseModel):
    skill_id: int
    type: str = Field(..., description="'know' or 'learn'")
    level: str = Field(..., description="'Beginner', 'Intermediate', 'Advanced'")

class UserSkillCreate(UserSkillBase):
    pass

class UserSkill(UserSkillBase):
    id: int
    user_id: int
    skill: Skill
    
    model_config = {"from_attributes": True}

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    college: str | None = None
    bio: str | None = None
    availability: str | None = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: str | None = None
    college: str | None = None
    bio: str | None = None
    availability: str | None = None

class User(UserBase):
    id: int
    created_at: datetime.datetime
    skills: list[UserSkill] = []
    
    model_config = {"from_attributes": True}

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None

class MatchResponse(BaseModel):
    user: User
    score: int
    overlapping_skills: int
    mutual_swap: bool
