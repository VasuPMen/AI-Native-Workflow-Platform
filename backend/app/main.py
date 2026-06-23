from fastapi import FastAPI
from app.db.__init__ import init_db
from app.api.workflows import router as workflow_router
app = FastAPI()

@app.on_event("startup")
def startup():
    init_db()

@app.get("/")
def root():
    return {"message": "API working"}

app.include_router(workflow_router)