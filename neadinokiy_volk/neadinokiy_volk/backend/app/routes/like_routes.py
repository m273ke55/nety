from fastapi import APIRouter, Depends, HTTPException
from ..deps import get_db, get_current_profile
from ..crud import like_profile, swipe_action

router = APIRouter(prefix="/likes", tags=["likes"])

@router.post("/like/{to_profile_id}")
def like(to_profile_id: int, profile=Depends(get_current_profile), db=Depends(get_db)):
    like_profile(db, profile.id, to_profile_id)
    return {"status": "liked"}

@router.post("/swipe/{to_profile_id}")
def swipe(to_profile_id: int, liked: bool, profile=Depends(get_current_profile), db=Depends(get_db)):
    swipe_action(db, profile.id, to_profile_id, liked)
    return {"status": "ok"}
