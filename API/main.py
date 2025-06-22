from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import usuarios, agencias, roles, rutas, lugares, horarios, notas, login

Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS
origins = ["http://localhost:4321"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(usuarios.router)
app.include_router(agencias.router)
app.include_router(roles.router)
app.include_router(rutas.router)
app.include_router(lugares.router)
app.include_router(horarios.router)
app.include_router(notas.router)
app.include_router(login.router)
