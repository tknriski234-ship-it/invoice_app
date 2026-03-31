from fastapi import FastAPI
from app.modules.router import router

app = FastAPI()

@app.get("/")
def root():
    return {"message" : "success"}

app.include_router(router)