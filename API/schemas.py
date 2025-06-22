from pydantic import BaseModel
from datetime import date, time
from typing import Optional


# Base Model
class UsuarioBase(BaseModel):
    correo: str
    nombre: str
    primer_apellido: str
    id_role: int
    telefono: str
    contraseña: str


class LoginUsuario(BaseModel):
    correo: str
    contraseña: str


class RoleBase(BaseModel):
    id: int
    nombre: str


class AgenciaBase(BaseModel):
    id: int
    nombre: str
    url_img: Optional[str] = None
    correo_usuario: str


class HorarioBase(BaseModel):
    id: int
    id_ruta: int
    id_agencia: int
    precio: int
    hora_salida: time
    hora_llegada: time


class RutaBase(BaseModel):
    id: int
    origen: int
    destino: int


class PagoBase(BaseModel):
    correo_usuario: str
    id_horario: int
    fecha_compra: date
    usado: bool


class LugarBase(BaseModel):
    id: int
    nombre: str


class NotaBase(BaseModel):
    id: int
    texto: str
    id_agencia: int


# Crear
class UsuarioCrear(UsuarioBase):
    pass


class AgenciaCrear(BaseModel):
    nombre: str
    url_img: str
    correo_usuario: str


class HorarioCrear(BaseModel):
    origen: int
    destino: int
    id_agencia: int
    precio: int
    hora_salida: time
    hora_llegada: time


class UsuarioActualizar(BaseModel):
    nombre: Optional[str] = None
    primer_apellido: Optional[str] = None
    id_role: Optional[int] = None
    telefono: Optional[str] = None
    contraseña: Optional[str] = None
    correo: Optional[str] = None

    class Config:
        orm_mode = True


class HorarioActualizar(BaseModel):
    precio: Optional[int] = None
    hora_salida: Optional[str] = None
    hora_llegada: Optional[str] = None
    id_agencia: Optional[int] = None
    origen: Optional[int] = None
    destino: Optional[int] = None


class AgenciaActualizar(BaseModel):
    nombre: str
    url_img: str
    correo_usuario: str


class AgenciaActualizar2(BaseModel):
    nombre: Optional[str] = None
    url_img: Optional[str] = None
    correo_usuario: Optional[str] = None


class NotaCrear(BaseModel):
    texto: str
    id_agencia: int


class PagoCrear(PagoBase):
    pass


# Mostrar
class UsuarioMostrar(UsuarioBase):
    class Config:
        orm_mode = True


class AgenciaMostrar(AgenciaBase):
    class Config:
        orm_mode = True


class HorarioMostrar(HorarioBase):
    class Config:
        orm_mode = True


class HorarioNombreMostrar(HorarioBase):
    origen: str
    destino: str

    class Config:
        orm_mode = True


class RutaNombreMostrar(BaseModel):
    id: int
    origen_id: int
    destino_id: int
    origen: str
    destino: str

    class Config:
        orm_mode = True


class NotaMostrar(NotaBase):
    class Config:
        orm_mode = True


class RutaMostrar(RutaBase):
    class Config:
        orm_mode = True


class RoleMostrar(RoleBase):
    class Config:
        orm_mode = True


class LugarMostrar(LugarBase):
    class Config:
        orm_mode = True
