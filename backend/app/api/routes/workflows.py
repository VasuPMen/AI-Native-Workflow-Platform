from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db

from app.schemas.workflow import (
    WorkflowCreate,
    WorkflowUpdate,
    WorkflowResponse
)

from app.schemas.execution import (
    WorkflowExecutionResponse
)

from app.services.workflow_service import (
    create_workflow,
    get_workflows,
    get_workflow,
    update_workflow,
    delete_workflow
)

from app.services.execution_service import (
    execute_workflow
)

router = APIRouter(
    prefix="/workflows",
    tags=["workflows"]
)


@router.post(
 "/",
    response_model=WorkflowResponse
)
def create_workflow_api(
    payload: WorkflowCreate,
    db: Session = Depends(get_db)
):
    return create_workflow(
        db=db,
        user_id=1,
        name=payload.name,
        description=payload.description,
        workflow_json=payload.workflow_json
    )


@router.get(
    "/",
    response_model=List[WorkflowResponse]
)
def get_workflows_api(
    db: Session = Depends(get_db)
):
    return get_workflows(db)


@router.get(
    "/{workflow_id}",
    response_model=WorkflowResponse
)
def get_workflow_api(
    workflow_id: int,
    db: Session = Depends(get_db)
):
    workflow = get_workflow(
        db,
        workflow_id
    )

    if workflow is None:
        raise HTTPException(
            status_code=404,
            detail="Workflow not found"
        )

    return workflow


@router.put(
    "/{workflow_id}",
    response_model=WorkflowResponse
)

def update_workflow_api(
    workflow_id: int,
    payload: WorkflowUpdate,
    db: Session = Depends(get_db)
):
    workflow = update_workflow(
        db=db,
        workflow_id=workflow_id,
        data=payload
    )

    if workflow is None:
        raise HTTPException(
            status_code=404,
            detail="Workflow not found"
        )

    return workflow


@router.delete("/{workflow_id}")
def delete_workflow_api(
    workflow_id: int,
    db: Session = Depends(get_db)
):
    success = delete_workflow(
        db,
        workflow_id
    )

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Workflow not found"
        )

    return {
        "message": "Workflow deleted successfully"
    }

@router.post(
    "/{workflow_id}/execute",
    response_model=WorkflowExecutionResponse
)


@router.post(
    "/{workflow_id}/execute",
    response_model=WorkflowExecutionResponse
)
def execute_workflow_api(
    workflow_id: int,
    db: Session = Depends(get_db)
):
    workflow = get_workflow(
        db,
        workflow_id
    )

    if workflow is None:
        raise HTTPException(
            status_code=404,
            detail="Workflow not found"
        )

    try:
        return execute_workflow(
            db=db,
            workflow=workflow
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )