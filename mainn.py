from fastapi import FastAPI
from main2 import router as user_router
app = FastAPI()

app.include_router(user_router)