from fastapi import APIRouter, HTTPException
from .. import models, schemas
from .deps import DBDep, CurrentUser

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/me", response_model=schemas.User)
def get_me(current_user: CurrentUser):
    return current_user

@router.put("/me", response_model=schemas.User)
def update_me(user_in: schemas.UserUpdate, current_user: CurrentUser, db: DBDep):
    if user_in.full_name is not None:
        current_user.full_name = user_in.full_name
    if user_in.college is not None:
        current_user.college = user_in.college
    if user_in.bio is not None:
        current_user.bio = user_in.bio
    if user_in.availability is not None:
        current_user.availability = user_in.availability
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/me/skills", response_model=schemas.UserSkill)
def add_skill(skill_in: schemas.UserSkillCreate, current_user: CurrentUser, db: DBDep):
    skill = db.query(models.Skill).filter(models.Skill.id == skill_in.skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    existing = db.query(models.UserSkill).filter(
        models.UserSkill.user_id == current_user.id,
        models.UserSkill.skill_id == skill_in.skill_id,
        models.UserSkill.type == skill_in.type
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Skill already added")
        
    user_skill = models.UserSkill(
        user_id=current_user.id,
        skill_id=skill_in.skill_id,
        type=skill_in.type,
        level=skill_in.level
    )
    db.add(user_skill)
    db.commit()
    db.refresh(user_skill)
    return user_skill

@router.delete("/me/skills/{user_skill_id}")
def remove_skill(user_skill_id: int, current_user: CurrentUser, db: DBDep):
    user_skill = db.query(models.UserSkill).filter(
        models.UserSkill.id == user_skill_id,
        models.UserSkill.user_id == current_user.id
    ).first()
    if not user_skill:
        raise HTTPException(status_code=404, detail="User skill not found")
        
    db.delete(user_skill)
    db.commit()
    return {"detail": "Skill removed"}

@router.get("/directory", response_model=list[schemas.User])
def get_directory(db: DBDep, skill: str | None = None, level: str | None = None):
    query = db.query(models.User)
    
    if skill or level:
        query = query.join(models.UserSkill).join(models.Skill)
        if skill:
            query = query.filter(models.Skill.name.ilike(f"%{skill}%"))
        if level:
            query = query.filter(models.UserSkill.level == level)
            
    return query.all()

@router.get("/{user_id}", response_model=schemas.User)
def get_user_by_id(user_id: int, db: DBDep):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
