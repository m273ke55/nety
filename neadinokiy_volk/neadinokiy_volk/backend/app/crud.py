from .models import User, Profile, Interest, Like, Message
from .db import SessionLocal
from sqlalchemy.orm import Session
from .auth import get_password_hash
from .auth import verify_password
from uuid import uuid5, NAMESPACE_DNS
import os
from base64 import b64encode
import uvicorn


def create_user(db: Session, username: str, email: str, password: str):
    user = User(username=username, email=email, hashed_password=get_password_hash(password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def create_or_update_profile(db: Session, user_id: int, payload):
    p = db.query(Profile).filter(Profile.user_id==user_id).first()
    print(p)
    u = db.query(User).filter(User.id == user_id).first()
    if not p:
        print('is not p')
        p = Profile(user_id=user_id, bio=payload.bio, display_name=payload.display_name)
        print(p, p.user_id, p.bio, p.display_name)
        db.add(p)
        db.commit()
        db.refresh(p)
    else:
        p.display_name = u.username
        p.bio = payload.bio
        p.interests = []
    for name in payload.interests or []:
        p.interests.append(Interest(name=name))
    db.add(p)
    db.commit()
    db.refresh(p)
    return p


def like_profile(db: Session, from_profile_id: int, to_profile_id: int):
    l = Like(from_profile=from_profile_id, to_profile=to_profile_id)
    db.add(l)
    db.commit()

def get_or_create_chat_id_for_profiles(db: Session, profile_a: int, profile_b: int) -> str:
    pa = db.query(Profile).filter(Profile.id==profile_a).first()
    pb = db.query(Profile).filter(Profile.id==profile_b).first()
    if not pa or not pb:
        raise Exception("Profile not found")
    names = sorted([pa.display_name or f"profile{pa.id}", pb.display_name or f"profile{pb.id}"])
    name_concat = names[0] + "|" + names[1]
    chat_uuid = str(uuid5(NAMESPACE_DNS, name_concat))
    return chat_uuid

def create_message(db: Session, chat_id: str, from_profile: int, to_profile: int, text: str):
    m = Message(chat_id=chat_id, from_profile=from_profile, to_profile=to_profile, text=text)
    db.add(m)
    db.commit()
    db.refresh(m)
    return m

def get_chat_messages(db: Session, chat_id: str):
    messages = db.query(Message, Profile.display_name).join(Profile, Message.from_profile == Profile.id).filter(Message.chat_id==chat_id).order_by(Message.created_at.asc()).all()
    result = []
    for message, display_name in messages:
        result.append({
            'id': message.id,
            'chat_id': message.chat_id,
            'from_profile': message.from_profile,
            'to_profile': message.to_profile,
            'text': message.text,
            'created_at': message.created_at,
            'display_name': display_name
        })
    return result

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

def get_profiles_for_user(db: Session, current_profile_id: int, skip: int = 0, limit: int = 20):
    liked_ids = db.query(Like.to_profile).filter(Like.from_profile == current_profile_id).all()
    liked_ids = [lid[0] for lid in liked_ids]

    profiles_data = db.query(Profile).filter(
        Profile.id != current_profile_id,
        Profile.id.notin_(liked_ids)
    ).order_by(Profile.created_at.desc()).offset(skip).limit(limit).all() 
    
    profiles = []

    for profile in profiles_data:
        avatar_path = profile.avatar_path

        avatar_bytes = None
        if avatar_path and os.path.exists(avatar_path):
            try:
                with open(avatar_path, 'rb') as f:
                    avatar_bytes = f.read()
                avatar_bytes = b64encode(avatar_bytes).decode(encoding='utf-8')
            except Exception as e:
                avatar_bytes = None

        profile_json = {
            'display_name': profile.display_name,
            'avatar_bytes': f"data:image/png;base64, {avatar_bytes}",  
            'user_id': profile.user_id,
            'id': profile.id,
            'created_at': profile.created_at,
            'bio': profile.bio,
            'avatar_path': profile.avatar_path
        }

        profiles.append(profile_json)

    return profiles

def swipe_action(db: Session, from_profile_id: int, to_profile_id: int, liked: bool):
    if liked:
        existing = db.query(Like).filter(
            Like.from_profile == from_profile_id,
            Like.to_profile == to_profile_id
        ).first()
        if not existing:
            like = Like(from_profile=from_profile_id, to_profile=to_profile_id)
            db.add(like)
            db.commit()

def update_profile_avatar(db: Session, profile_id: int, avatar_path: str):
    profile = db.query(Profile).filter(Profile.id == profile_id).first()
    if profile:
        profile.avatar_path = avatar_path
        db.commit()
        db.refresh(profile)
    return profile
