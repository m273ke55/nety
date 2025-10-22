from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import crud, schemas, auth, deps
from ..schemas import ProfileBase

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=schemas.UserOut)
def register(user_in: schemas.UserCreate, db: Session = Depends(deps.get_db)):
    user = crud.get_user_by_username(db, username=user_in.username)
    if user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    user = crud.get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = crud.create_user(db, user_in.username, user_in.email, user_in.password)
    p = ProfileBase()
    p.display_name = user_in.username
    profile = crud.create_or_update_profile(db, user.id, p)

    return user


@router.post("/login", response_model=schemas.Token)
def login(form: schemas.UserLogin, db: Session = Depends(deps.get_db)):
    user = crud.authenticate_user(db, form.username, form.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    access_token = auth.create_access_token(subject=user.username)
    return {"access_token": access_token, "token_type": "bearer"}
