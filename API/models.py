from sqlalchemy import Column, Integer, String, ForeignKey, Date, Boolean, Time
from database import Base


class Roles(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(25), nullable=False)


class Usuarios(Base):
    __tablename__ = "usuarios"
    correo = Column(String(100), primary_key=True, index=True)
    nombre = Column(String(50), nullable=False)
    primer_apellido = Column(String(50), nullable=False)
    contraseña = Column(String(100), nullable=False)
    telefono = Column(String(25), nullable=False)
    id_role = Column(Integer, ForeignKey("roles.id"), nullable=False)


class Agencias(Base):
    __tablename__ = "agencias"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    url_img = Column(String(500), nullable=False)
    correo_usuario = Column(String(100), ForeignKey("usuarios.correo"))


class Notas(Base):
    __tablename__ = "notas"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    texto = Column(String(250), nullable=False)
    id_agencia = Column(Integer, ForeignKey("agencias.id"))
    fecha_eliminacion = Column(Date)


class Lugares(Base):
    __tablename__ = "lugares"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(50), nullable=False)


class Rutas(Base):
    __tablename__ = "rutas"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    origen = Column(Integer, ForeignKey("lugares.id"))
    destino = Column(Integer, ForeignKey("lugares.id"))


class Horarios(Base):
    __tablename__ = "horarios"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_ruta = Column(Integer, ForeignKey("rutas.id"))
    id_agencia = Column(Integer, ForeignKey("agencias.id"))
    precio = Column(Integer, nullable=False)
    hora_salida = Column(Time, nullable=False)
    hora_llegada = Column(Time, nullable=False)


class Pagos(Base):
    __tablename__ = "pagos"
    correo_usuario = Column(
        String, ForeignKey("usuarios.correo"), primary_key=True, index=True
    )
    id_horario = Column(Integer, ForeignKey("horarios.id"), primary_key=True)
    fecha_compra = Column(Date, nullable=False)
    usado = Column(Boolean, nullable=False)
