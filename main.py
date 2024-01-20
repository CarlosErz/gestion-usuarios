from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, DateTime, MetaData,Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel
from datetime import datetime
from model.empleados import Empleado
from fastapi import Query, Path
DATABASE_URL = "sqlite:///./test.sqlite"

Base = declarative_base()

class EmpleadoModel(Base):
    __tablename__ = "empleados"
    id =  Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    fecha_ingres = Column(Date)  # Cambiando de DateTime a Date
    puesto = Column(String)
    salario_mensual = Column(Integer)



origins = [
  'http://localhost:5173',
  'https://gestion-usuarios-mocha.vercel.app',
  'https://gestion-usuarios-mocha.vercel.app/'
];

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
    
)

engine = create_engine(DATABASE_URL)
Base.metadata.create_all(bind=engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@app.get("/api/v1/empleados", response_model=list[Empleado])
def read_users():
    with SessionLocal() as session:
        empleados = session.query(EmpleadoModel).all()
        return empleados

#BUSCAR EMPLEADO POR ID
@app.get("/api/v1/empleados/{id}", response_model=Empleado)
def read_user(id: int):
    with SessionLocal() as session:
        empleado = session.query(EmpleadoModel).filter(EmpleadoModel.id == id).first()
        if empleado:
            return empleado
        raise HTTPException(status_code=404, detail="Empleado no encontrado")


#FUNCION PARA OBTENER EL SIGUIENTE ID
def get_next_id():
    with SessionLocal() as session:
        max_id = session.query(EmpleadoModel.id).order_by(EmpleadoModel.id.desc()).first()
        return (max_id.id + 1) if max_id and max_id.id else 1


#REGISTRAR EMPLEADO
@app.post("/api/v1/empleados", response_model=Empleado)
def create_user(empleado: Empleado):
    try:
        with SessionLocal() as session:
            new_empleado = EmpleadoModel(
                id=get_next_id(),
                nombre=empleado.nombre,
                fecha_ingres=empleado.fecha_ingres,  # No es necesario convertirlo con strptime
                puesto=empleado.puesto,
                salario_mensual=empleado.salario_mensual,
            )
            session.add(new_empleado)
            session.commit()
            session.refresh(new_empleado)
            return new_empleado
    except Exception as e:
        print(f"Error al insertar en la base de datos: {e}")
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {e}")



#ELMINAR EMPLEADO POR ID
@app.delete("/api/v1/empleados/{id}")
def delete_user(id: int):
    with SessionLocal() as session:
        empleado = session.query(EmpleadoModel).filter(EmpleadoModel.id == id).first()
        if empleado:
            session.delete(empleado)
            session.commit()
            return {"message": "Empleado borrado exitosamente"}
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
