from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import DataError
from database import get_db
import models, schemas

router = APIRouter(prefix="/agencias", tags=["agencias"])


@router.post("/", response_model=schemas.AgenciaMostrar)
def crear_agencia(agencia: schemas.AgenciaCrear, db: Session = Depends(get_db)):
    try:
        db_agencia = models.Agencias(**agencia.dict())
        db.add(db_agencia)
        db.commit()
        db.refresh(db_agencia)
        return db_agencia
    except DataError:
        db.rollback()
        raise HTTPException(
            status_code=400, detail="img_url excede el límite de 500 caracteres."
        )


@router.get("/", response_model=list[schemas.AgenciaMostrar])
def leer_agencias(db: Session = Depends(get_db)):
    return db.query(models.Agencias).all()


@router.get("/{id}", response_model=schemas.AgenciaMostrar)
def leer_agencia(id: int, db: Session = Depends(get_db)):
    agencia = db.query(models.Agencias).filter(models.Agencias.id == id).first()
    if not agencia:
        raise HTTPException(status_code=404, detail="Agencia no encontrada")
    return agencia


@router.patch("/{id}", response_model=schemas.AgenciaMostrar)
def actualizar_parcial_agencia(
    id: int, agencia: schemas.AgenciaActualizar2, db: Session = Depends(get_db)
):
    agencia_db = db.query(models.Agencias).filter(models.Agencias.id == id).first()

    if not agencia_db:
        raise HTTPException(status_code=404, detail="Agencia no encontrada")

    if agencia.correo_usuario:
        usuario = (
            db.query(models.Usuarios)
            .filter(models.Usuarios.correo == agencia.correo_usuario)
            .first()
        )
        if not usuario:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

    try:
        # Solo actualiza los campos que están presentes (no None)
        for key, value in agencia.dict(exclude_unset=True).items():
            setattr(agencia_db, key, value)

        db.commit()
        db.refresh(agencia_db)
        return agencia_db

    except DataError:
        db.rollback()
        raise HTTPException(
            status_code=400, detail="img_url excede el límite de 500 caracteres."
        )


@router.put("/", response_model=schemas.AgenciaMostrar)
def actualizar_agencia(
    agencia: schemas.AgenciaActualizar, db: Session = Depends(get_db)
):
    agencia_db = (
        db.query(models.Agencias).filter(models.Agencias.id == agencia.id).first()
    )

    if not agencia_db:
        raise HTTPException(status_code=404, detail="Agencia no encontrada")

    correo_usuario = (
        db.query(models.Usuarios)
        .filter(models.Usuarios.correo == agencia.correo_usuario)
        .first()
    )

    if not correo_usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    try:
        for key, value in agencia.dict(exclude_unset=True).items():
            setattr(agencia_db, key, value)

        db.commit()
        db.refresh(agencia_db)
        return agencia_db

    except DataError:
        db.rollback()
        raise HTTPException(
            status_code=400, detail="img_url excede el límite de 500 caracteres."
        )


@router.delete("/{id}")
def eliminar_agencia(id: int, db: Session = Depends(get_db)):
    agencias = db.query(models.Agencias).filter(models.Agencias.id == id).first()
    if not agencias:
        raise HTTPException(status_code=404, detail="Agencia no encontrada")

    db.query(models.Horarios).filter(models.Horarios.id_agencia == id).delete()
    db.query(models.Notas).filter(models.Notas.id_agencia == id).delete()

    db.delete(agencias)
    db.commit()
    return {"ok": True}
