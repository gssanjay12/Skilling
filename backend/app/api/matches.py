from fastapi import APIRouter
from .. import schemas
from .deps import DBDep, CurrentUser
from ..services.matching import calculate_matches

router = APIRouter(prefix="/api/matches", tags=["matches"])

@router.get("/", response_model=list[schemas.MatchResponse])
def get_matches(current_user: CurrentUser, db: DBDep):
    matches = calculate_matches(current_user, db)
    return matches
