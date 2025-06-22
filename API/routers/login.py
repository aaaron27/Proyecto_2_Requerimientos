from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/login", tags=["login"])


@router.post("/", response_model=schemas.UsuarioMostrar)
def login(user: schemas.LoginUsuario, db: Session = Depends(get_db)):
    db_user = (
        db.query(models.Usuarios)
        .filter(
            models.Usuarios.correo == user.correo,
            models.Usuarios.contraseña == user.contraseña,
        )
        .first()
    )
    if not db_user:
        raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")

    return db_user
