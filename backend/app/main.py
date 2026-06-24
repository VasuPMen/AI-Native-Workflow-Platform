from fastapi import FastAPI
from app.db.__init__ import init_db
from app.api.workflows import router as workflow_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.on_event("startup")
def startup():
    init_db()

@app.get("/")
def root():
    return {"message": "API working"}

app.include_router(workflow_router)