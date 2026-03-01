import sys
import os

# add parent directory to path so we can import app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine
from app import models
from app.core.security import get_password_hash

def seed_db():
    print("Creating tables...")
    models.Base.metadata.drop_all(bind=engine)
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    print("Adding default skills...")
    skills = [
        "Python", "JavaScript", "React", "FastAPI", 
        "Data Science", "Machine Learning", "UI/UX Design",
        "Public Speaking", "SEO", "Digital Marketing", "Guitar"
    ]
    skill_objects = []
    for skill_name in skills:
        skill = models.Skill(name=skill_name)
        db.add(skill)
        skill_objects.append(skill)
    db.commit()
    
    print("Adding dummy users...")
    users = [
        models.User(email="alice@college.edu", full_name="Alice Smith", password_hash=get_password_hash("password"), college="Tech Univ", bio="CS student loving AI"),
        models.User(email="bob@college.edu", full_name="Bob Jones", password_hash=get_password_hash("password"), college="Design Inst", bio="Design major, trying to code"),
        models.User(email="charlie@college.edu", full_name="Charlie Brown", password_hash=get_password_hash("password"), college="Tech Univ", bio="Frontend enthusiast"),
    ]
    db.add_all(users)
    db.commit()
    
    print("Adding user skills (for matches)...")
    # Alice knows Python and ML, wants to learn UI/UX
    user_skills = [
        # Alice
        models.UserSkill(user_id=1, skill_id=1, type="know", level="Advanced"), # Python
        models.UserSkill(user_id=1, skill_id=6, type="know", level="Intermediate"), # ML
        models.UserSkill(user_id=1, skill_id=7, type="learn", level="Beginner"), # UI/UX
        
        # Bob
        models.UserSkill(user_id=2, skill_id=7, type="know", level="Advanced"), # UI/UX
        models.UserSkill(user_id=2, skill_id=1, type="learn", level="Beginner"), # Python
        
        # Charlie
        models.UserSkill(user_id=3, skill_id=3, type="know", level="Intermediate"), # React
        models.UserSkill(user_id=3, skill_id=2, type="know", level="Intermediate"), # JavaScript
        models.UserSkill(user_id=3, skill_id=1, type="learn", level="Intermediate"), # Python
    ]
    db.add_all(user_skills)
    db.commit()
    
    print("Database seeded successfully!")
    db.close()

if __name__ == "__main__":
    seed_db()
