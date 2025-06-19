from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from database import get_db
import models, schemas

router = APIRouter(prefix="/notas", tags=["notas"])


@router.post("/", response_model=schemas.NotaMostrar)
def crear_nota(nota: schemas.NotaCrear, db: Session = Depends(get_db)):
    try:
        db_nota = models.Notas(**nota.dict())
        db.add(db_nota)
        db.commit()
        db.refresh(db_nota)
        return db_nota
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Agencia id not found")


@router.get("/", response_model=list[schemas.NotaMostrar])
def leer_notas(db: Session = Depends(get_db)):
    return db.query(models.Notas).all()


@router.get("/{id}", response_model=schemas.NotaMostrar)
def leer_nota(id: int, db: Session = Depends(get_db)):
    nota = db.query(models.Notas).filter(models.Notas.id == id).first()
    if not nota:
        raise HTTPException(status_code=404, detail="Nota no encontrado")
    return nota


@router.get("/agencias/{id_agencia}", response_model=list[schemas.NotaMostrar])
def leer_notas(id_agencia: int, db: Session = Depends(get_db)):
    notas = db.query(models.Notas).filter(models.Notas.id_agencia == id_agencia).all()
    return notas


@router.delete("/{id}")
def eliminar_usuario(id: int, db: Session = Depends(get_db)):
    nota = db.query(models.Notas).filter(models.Notas.id == id).first()
    if not nota:
        raise HTTPException(status_code=404, detail="Nota no encontrado")
    db.delete(nota)
    db.commit()
    return {"ok": True}
