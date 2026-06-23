from sqlalchemy.orm import Session
from typing import Any
from app.models.workflow import Workflow


def create_workflow(
    db: Session,
    user_id: int,
    name: str,
    description: str | None = None,
    workflow_json=None
):
    workflow = Workflow(
        user_id=user_id,
        name=name,
        description=description,
        workflow_json=workflow_json
    )

    db.add(workflow)
    db.commit()
    db.refresh(workflow)

    return workflow

def get_workflows(db: Session):
    return db.query(Workflow).all()


def get_workflow(db: Session, workflow_id: int):
    return (
        db.query(Workflow)
        .filter(Workflow.id == workflow_id)
        .first()
    )

def update_workflow(
    db: Session,
    workflow_id: int,
    data
):
    workflow = (
        db.query(Workflow)
        .filter(Workflow.id == workflow_id)
        .first()
    )

    if not workflow:
        return None

    if data.name is not None:
        workflow.name = data.name

    if data.description is not None:
        workflow.description = data.description

    if data.workflow_json is not None:
        workflow.workflow_json = data.workflow_json

    db.commit()
    db.refresh(workflow)

    return workflow

def delete_workflow(
    db: Session,
    workflow_id: int
):
    workflow = (
        db.query(Workflow)
        .filter(Workflow.id == workflow_id)
        .first()
    )

    if not workflow:
        return False

    db.delete(workflow)
    db.commit()

    return True