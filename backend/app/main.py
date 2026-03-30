from fastapi import FastAPI , Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import get_db

app = FastAPI()

@app.get("/get_db")
def get_cek_db(db : Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ok"}
    except:
        return {"status" : "failed"}