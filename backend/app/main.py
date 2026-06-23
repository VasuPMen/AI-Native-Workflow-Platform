from fastapi import FastAPI

from app.db.__init__ import init_db

app = FastAPI()


@app.on_event("startup")
def startup():
    init_db()