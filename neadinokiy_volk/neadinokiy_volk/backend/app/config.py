from typing import ClassVar, Set
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://user:password@db:5432/dating_app"
    SECRET_KEY: str = "supersecretkey"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    UPLOAD_DIR: str = "uploads"
    MAX_AVATAR_SIZE: ClassVar[int] = 5 * 1024 * 1024  

    class Config:
        env_file = ".env"

settings = Settings()
