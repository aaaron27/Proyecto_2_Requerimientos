from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db
import models, schemas

router = APIRouter(prefix="/rutas", tags=["rutas"])


@router.get("/", response_model=list[schemas.RutaMostrar])
def leer_rutas(db: Session = Depends(get_db)):
    return db.query(models.Rutas).all()


@router.get("/nombre", response_model=list[schemas.RutaNombreMostrar])
def leer_rutas_nombres(db: Session = Depends(get_db)):
    res = db.execute(
        text(
            """
        SELECT r.id,
            l1.id AS origen_id,
            l2.id AS destino_id,
            l1.nombre AS origen,
            l2.nombre AS destino
        FROM rutas r
        JOIN lugares l1 ON r.origen = l1.id
        JOIN lugares l2 ON r.destino = l2.id
        """
        )
    )
    return res.mappings().all()


@router.get("/nombre/{id}", response_model=list[schemas.RutaNombreMostrar])
def leer_rutas_nombres(id: int, db: Session = Depends(get_db)):
    res = db.execute(
        text(
            """
        SELECT r.id,
            l1.id AS origen_id,
            l2.id AS destino_id,
            l1.nombre AS origen,
            l2.nombre AS destino
        FROM rutas r
        JOIN lugares l1 ON r.origen = l1.id
        JOIN lugares l2 ON r.destino = l2.id
        WHERE r.id = :id
        """
        ),
        {"id": id},
    )
    return res.mappings().all()


@router.get("/{id}", response_model=schemas.RutaMostrar)
def leer_ruta(id: int, db: Session = Depends(get_db)):
    ruta = db.query(models.Rutas).filter(models.Rutas.id == id).first()
    if not ruta:
        raise HTTPException(status_code=404, detail="Ruta no encontrado")
    return ruta
