from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.schemas.credential import (
    CredentialCreate,
    CredentialResponse
)
from app.services.credential_service import (
    create_credential,
    get_credentials,
    get_credential,
    delete_credential
)

router = APIRouter(
    prefix="/credentials",
    tags=["credentials"]
)


@router.post(
    "/",
    response_model=CredentialResponse
)
def create_credential_api(
    payload: CredentialCreate,
    db: Session = Depends(get_db)
):
    return create_credential(
        db=db,
        user_id=1,
        data=payload
    )


@router.get(
    "/",
    response_model=List[CredentialResponse]
)
def get_credentials_api(
    db: Session = Depends(get_db)
):
    return get_credentials(
        db=db,
        user_id=1
    )


@router.get(
    "/{credential_id}",
    response_model=CredentialResponse
)
def get_credential_api(
    credential_id: int,
    db: Session = Depends(get_db)
):
    credential = get_credential(
        db=db,
        credential_id=credential_id,
        user_id=1
    )

    if credential is None:
        raise HTTPException(
            status_code=404,
            detail="Credential not found"
        )

    return credential


@router.delete("/{credential_id}")
def delete_credential_api(
    credential_id: int,
    db: Session = Depends(get_db)
):
    success = delete_credential(
        db=db,
        credential_id=credential_id,
        user_id=1
    )

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Credential not found"
        )

    return {
        "message": "Credential deleted successfully"
    }