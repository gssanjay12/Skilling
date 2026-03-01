from fastapi import APIRouter
from .. import models, schemas
from .deps import DBDep

router = APIRouter(prefix="/api/skills", tags=["skills"])

@router.get("/", response_model=list[schemas.Skill])
def get_skills(db: DBDep):
    return db.query(models.Skill).all()

@router.post("/", response_model=schemas.Skill)
def create_skill(skill_in: schemas.SkillCreate, db: DBDep):
    skill = models.Skill(name=skill_in.name)
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill
