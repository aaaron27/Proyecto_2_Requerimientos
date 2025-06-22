from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from sqlalchemy import text
import models, schemas

router = APIRouter(prefix="/horarios", tags=["horarios"])


@router.post("/", response_model=schemas.HorarioMostrar)
def crear_horario(horario: schemas.HorarioCrear, db: Session = Depends(get_db)):
    ruta = (
        db.query(models.Rutas)
        .filter(
            models.Rutas.origen == horario.origen,
            models.Rutas.destino == horario.destino,
        )
        .first()
    )

    if not ruta:
        nueva_ruta = models.Rutas(origen=horario.origen, destino=horario.destino)
        db.add(nueva_ruta)
        db.commit()
        db.refresh(nueva_ruta)
        ruta_id = nueva_ruta.id
    else:
        ruta_id = ruta.id

    nuevo_horario = models.Horarios(
        id_ruta=ruta_id,
        id_agencia=horario.id_agencia,
        hora_salida=horario.hora_salida,
        hora_llegada=horario.hora_llegada,
        precio=horario.precio,
    )

    db.add(nuevo_horario)
    db.commit()
    db.refresh(nuevo_horario)

    return nuevo_horario


@router.get("/", response_model=list[schemas.HorarioMostrar])
def leer_horarios(db: Session = Depends(get_db)):
    return db.query(models.Horarios).all()


@router.get("/nombre/{id_agencia}", response_model=list[schemas.HorarioNombreMostrar])
def leer_horarios_agencia(id_agencia: int, db: Session = Depends(get_db)):
    res = (
        db.execute(
            text(
                """
            SELECT h.id, 
                h.id_ruta, 
                h.id_agencia, 
                h.precio, 
                h.hora_salida, 
                h.hora_llegada, 
                l1.nombre AS origen, 
                l2.nombre AS destino
            FROM horarios h
            JOIN rutas r ON h.id_ruta = r.id
            JOIN lugares l1 ON r.origen = l1.id
            JOIN lugares l2 ON r.destino = l2.id
            WHERE h.id_agencia = :id_agencia
            """
            ),
            {"id_agencia": id_agencia},
        )
        .mappings()
        .all()
    )

    return res


@router.get("/{id}", response_model=schemas.HorarioMostrar)
def leer_horario(id: int, db: Session = Depends(get_db)):
    horario = db.query(models.Horarios).filter(models.Horarios.id == id).first()
    if not horario:
        raise HTTPException(status_code=404, detail="Horario no encontrado")
    return horario


@router.patch("/{id}", response_model=schemas.HorarioMostrar)
def actualizar_horario(
    id: int, horario: schemas.HorarioActualizar, db: Session = Depends(get_db)
):
    horario_db = db.query(models.Horarios).filter(models.Horarios.id == id).first()
    if not horario_db:
        raise HTTPException(status_code=404, detail="Horario no encontrado")

    ruta_actual = (
        db.query(models.Rutas).filter(models.Rutas.id == horario_db.id_ruta).first()
    )

    nuevo_origen = horario.origen if horario.origen is not None else ruta_actual.origen
    nuevo_destino = (
        horario.destino if horario.destino is not None else ruta_actual.destino
    )

    if nuevo_origen != ruta_actual.origen or nuevo_destino != ruta_actual.destino:
        ruta = (
            db.query(models.Rutas)
            .filter(
                models.Rutas.origen == nuevo_origen,
                models.Rutas.destino == nuevo_destino,
            )
            .first()
        )

        if not ruta:
            ruta = models.Rutas(origen=nuevo_origen, destino=nuevo_destino)
            db.add(ruta)
            db.commit()
            db.refresh(ruta)

        horario_db.id_ruta = ruta.id

    if horario.precio is not None:
        horario_db.precio = horario.precio
    if horario.hora_salida is not None:
        horario_db.hora_salida = horario.hora_salida
    if horario.hora_llegada is not None:
        horario_db.hora_llegada = horario.hora_llegada
    if horario.id_agencia is not None:
        horario_db.id_agencia = horario.id_agencia

    db.commit()
    db.refresh(horario_db)

    return horario_db


@router.delete("/{id}")
def eliminar_horario(id: int, db: Session = Depends(get_db)):
    horario = db.query(models.Horarios).filter(models.Horarios.id == id).first()
    if not horario:
        raise HTTPException(status_code=404, detail="Horario no encontrado")
    db.delete(horario)
    db.commit()
    return {"ok": True}
