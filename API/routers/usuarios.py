from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/usuarios", tags=["usuarios"])


@router.post("/", response_model=schemas.UsuarioMostrar)
def crear_usuario(usuario: schemas.UsuarioCrear, db: Session = Depends(get_db)):
    db_usuario = models.Usuarios(**usuario.dict())
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario


@router.get("/", response_model=list[schemas.UsuarioMostrar])
def leer_usuarios(db: Session = Depends(get_db)):
    return db.query(models.Usuarios).all()


@router.patch("/{correo}", response_model=schemas.UsuarioMostrar)
def actualizar_usuario(
    correo: str, cambios: schemas.UsuarioActualizar, db: Session = Depends(get_db)
):
    usuario_db = (
        db.query(models.Usuarios).filter(models.Usuarios.correo == correo).first()
    )
    if not usuario_db:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if cambios.correo and cambios.correo != correo:
        existente = (
            db.query(models.Usuarios)
            .filter(models.Usuarios.correo == cambios.correo)
            .first()
        )
        if existente:
            raise HTTPException(
                status_code=400, detail="El nuevo correo ya está en uso"
            )

    for key, value in cambios.dict(exclude_unset=True).items():
        setattr(usuario_db, key, value)

    db.commit()
    db.refresh(usuario_db)
    return usuario_db


@router.get("/{correo}", response_model=schemas.UsuarioMostrar)
def leer_usuario(correo: str, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuarios).filter(models.Usuarios.correo == correo).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario


@router.delete("/{correo}")
def eliminar_usuario(correo: str, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuarios).filter(models.Usuarios.correo == correo).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    db.delete(usuario)
    db.commit()
    return {"ok": True}
