from fastapi import FastAPI , Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import get_db
from app.modules.router import router as main_router

app = FastAPI()

app.include_router(main_router)

@app.get("/get_db")
def get_cek_db(db : Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ok"}
    except:
        return {"status" : "failed"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # nanti ganti domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)