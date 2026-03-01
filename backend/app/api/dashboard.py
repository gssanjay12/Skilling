from fastapi import APIRouter
from sqlalchemy import func
from .. import models, schemas
from .deps import DBDep

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/stats")
def get_dashboard_stats(db: DBDep):
    recently_joined = db.query(models.User).order_by(models.User.created_at.desc()).limit(5).all()
    
    trending_query = db.query(
        models.Skill, func.count(models.UserSkill.id).label('total')
    ).join(models.UserSkill).group_by(models.Skill).order_by(func.count(models.UserSkill.id).desc()).limit(5).all()
    
    trending_skills = [{"skill": t[0], "count": t[1]} for t in trending_query]
    
    return {
        "recently_joined": [schemas.User.model_validate(u) for u in recently_joined],
        "trending_skills": [{"skill": schemas.Skill.model_validate(t["skill"]), "count": t["count"]} for t in trending_skills]
    }
