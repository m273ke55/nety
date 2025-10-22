from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .db import Base, engine
from .routes import auth_routes, profile_routes, like_routes, chat_routes, upload_routes


app = FastAPI(title="Dating Site API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(profile_routes.router)
app.include_router(like_routes.router)
app.include_router(chat_routes.router)
app.include_router(upload_routes.router)

Base.metadata.create_all(bind=engine)


@app.get("/health")
def health():
    return {"status": "ok"}
