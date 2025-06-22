from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/lugares", tags=["lugares"])


@router.get("/", response_model=list[schemas.LugarMostrar])
def leer_lugares(db: Session = Depends(get_db)):
    return db.query(models.Lugares).all()


@router.get("/{id}", response_model=schemas.LugarMostrar)
def leer_lugares(id: int, db: Session = Depends(get_db)):
    lugar = db.query(models.Lugares).filter(models.Lugares.id == id).first()
    if not lugar:
        raise HTTPException(status_code=404, detail="Lugar no encontrado")
    return lugar
