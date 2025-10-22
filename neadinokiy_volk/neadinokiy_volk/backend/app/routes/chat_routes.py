from fastapi import APIRouter, Depends, HTTPException
from ..deps import get_current_profile, get_db
from ..schemas import MessageCreate, MessageOut, MessageSend
from ..crud import create_message, get_chat_messages, get_or_create_chat_id_for_profiles
from sqlalchemy.orm import Session as DBSession
import logging
from pydantic import BaseModel

logger = logging.getLogger("uvicorn.error")
router = APIRouter(prefix="/chat", tags=["chat"])

class MessageSend(BaseModel):
    text: str

@router.post("/send/{to_profile_id}")
def send_message(
    to_profile_id: int,
    payload: MessageSend, 
    profile=Depends(get_current_profile), 
    db: DBSession=Depends(get_db)
):
    chat_id = get_or_create_chat_id_for_profiles(db, profile.id, to_profile_id)
    msg = create_message(db, chat_id, profile.id, to_profile_id, payload.text)
    logger.debug(f"Message sent to chat: {chat_id}")
    return msg


@router.get("/{chat_id}")
def get_messages_by_chat_id(
    chat_id: str, 
    db=Depends(get_db), 
    profile=Depends(get_current_profile)
):
    logger.debug(f"Fetching messages for chat_id: {chat_id}")
    return get_chat_messages(db, chat_id)


@router.get("/with/{to_profile_id}")
def get_messages_by_profile_id(
    to_profile_id: int, 
    db: DBSession = Depends(get_db), 
    profile=Depends(get_current_profile)
):
    chat_id = get_or_create_chat_id_for_profiles(db, profile.id, to_profile_id)
    logger.debug(f"Fetching messages for chat_id: {chat_id} (with profile {to_profile_id})")
    return get_chat_messages(db, chat_id)
