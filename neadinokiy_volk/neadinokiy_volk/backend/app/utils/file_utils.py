import os
import shutil
from pathlib import Path
from fastapi import UploadFile, HTTPException
from ..config import settings  

async def save_avatar_file(upload: UploadFile, target_dir: str, filename: str) -> str:
    UPLOAD_DIR = Path(settings.UPLOAD_DIR)
    
    (UPLOAD_DIR / target_dir).mkdir(parents=True, exist_ok=True)
    dest = UPLOAD_DIR / target_dir / filename

    contents = await upload.read()
    if len(contents) > settings.MAX_AVATAR_SIZE:
        raise HTTPException(status_code=400, detail="File too large")

    with open(dest, "wb") as f:
        f.write(contents)

    return str(dest)
