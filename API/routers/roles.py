from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/roles", tags=["roles"])


@router.get("/", response_model=list[schemas.RoleMostrar])
def leer_roles(db: Session = Depends(get_db)):
    return db.query(models.Roles).all()