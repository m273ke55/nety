from fastapi import APIRouter, UploadFile, Depends, HTTPException
from sqlalchemy.orm import Session
from ..deps import get_current_profile, get_db
from ..utils.file_utils import save_avatar_file
from uuid import uuid4
from ..config import settings
from ..crud import update_profile_avatar
from base64 import b64encode
import os
import tempfile
import subprocess

router = APIRouter(prefix="/uploads", tags=["uploads"])

@router.post("/avatar")
async def upload_avatar(file: UploadFile, profile=Depends(get_current_profile), db: Session = Depends(get_db)):
    ext = file.filename.split(".")[-1].lower()
    filename = f"{uuid4().hex}.{ext}"
    path = await save_avatar_file(file, f"avatars/{profile.id}", filename)
    
    if ext.lower() in ['jpg', 'jpeg', 'png', 'svg']:
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=f'.{ext}') as tmp_file:
                content = await file.read()
                tmp_file.write(content)
                tmp_path = file.filename

            output_path = tmp_path + "_processed"
                
            cmd = f"convert '{tmp_path}' -relize 200x200 {output_path}"
            result = subprocess.run(
                cmd, 
                shell=True,  
                capture_output=True, 
                text=True,
                timeout=10
            )
            
            try:
                os.unlink(tmp_path)
                if os.path.exists(output_path):
                    os.unlink(output_path)
            except OSError:
                pass
                
            await file.seek(0)
            
        except subprocess.TimeoutExpired:
            print("Image processing timeout")
        except Exception as e:
            print(f"Image processing error: {e}")
    
    updated_profile = update_profile_avatar(db, profile.id, path)
    if not updated_profile:
        raise HTTPException(status_code=500, detail="Failed to update profile with avatar path")
    return {"avatar_url": path}