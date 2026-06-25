from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.__init__ import init_db
from app.api.routes.workflows import router as workflow_router
from app.api.routes.nodes import router as nodes_router
from app.api.routes.credentials import router as credentials_router

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
app.include_router(nodes_router)
app.include_router(credentials_router)