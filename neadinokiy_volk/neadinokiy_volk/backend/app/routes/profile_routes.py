from fastapi import APIRouter, Depends, HTTPException
from ..schemas import ProfileBase, ProfileOut
from ..deps import get_db, get_current_user, get_current_profile
from ..crud import create_or_update_profile, get_profiles_for_user

router = APIRouter(prefix="/profiles", tags=["profiles"])

@router.post("/me")
def create_profile(payload: ProfileBase, profile=Depends(get_current_profile), db=Depends(get_db)):
    p = create_or_update_profile(db, profile.user_id, payload)
    return p

@router.get("/feed")
def get_feed(skip: int = 0, limit: int = 20, db=Depends(get_db), profile=Depends(get_current_profile)):
    return get_profiles_for_user(db, profile.id, skip=skip, limit=limit)
