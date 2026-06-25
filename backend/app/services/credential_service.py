from sqlalchemy.orm import Session

from app.models.credential import Credential
from app.schemas.credential import CredentialCreate


def create_credential(
    db: Session,
    user_id: int,
    data: CredentialCreate
):
    credential = Credential(
        user_id=user_id,
        name=data.name,
        provider=data.provider,
        credential_type=data.credential_type,
        secret=data.secret
    )

    db.add(credential)
    db.commit()
    db.refresh(credential)

    return credential


def get_credentials(
    db: Session,
    user_id: int
):
    return (
        db.query(Credential)
        .filter(Credential.user_id == user_id)
        .order_by(Credential.id.desc())
        .all()
    )


def get_credential(
    db: Session,
    credential_id: int,
    user_id: int
):
    return (
        db.query(Credential)
        .filter(Credential.id == credential_id)
        .filter(Credential.user_id == user_id)
        .first()
    )


def delete_credential(
    db: Session,
    credential_id: int,
    user_id: int
):
    credential = get_credential(
        db,
        credential_id,
        user_id
    )

    if credential is None:
        return False

    db.delete(credential)
    db.commit()

    return True