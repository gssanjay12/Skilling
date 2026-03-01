from .. import models, schemas
from sqlalchemy.orm import Session

def calculate_matches(current_user: models.User, db: Session) -> list[schemas.MatchResponse]:
    my_learn_skills = {us.skill_id for us in current_user.skills if us.type == "learn"}
    my_know_skills = {us.skill_id for us in current_user.skills if us.type == "know"}
    
    candidates = db.query(models.User).filter(models.User.id != current_user.id).all()
    
    matches_list = []
    
    for candidate in candidates:
        candidate_learn_skills = {us.skill_id for us in candidate.skills if us.type == "learn"}
        candidate_know_skills = {us.skill_id for us in candidate.skills if us.type == "know"}
        
        overlap_1 = my_learn_skills.intersection(candidate_know_skills)
        overlap_2 = candidate_learn_skills.intersection(my_know_skills)
        
        overlapping_count = len(overlap_1) + len(overlap_2)
        
        if overlapping_count > 0:
            score = overlapping_count * 10
            mutual_swap = len(overlap_1) > 0 and len(overlap_2) > 0
            if mutual_swap:
                score += 20
                
            matches_list.append(schemas.MatchResponse(
                user=candidate,
                score=score,
                overlapping_skills=overlapping_count,
                mutual_swap=mutual_swap
            ))
            
    matches_list.sort(key=lambda x: x.score, reverse=True)
    return matches_list
