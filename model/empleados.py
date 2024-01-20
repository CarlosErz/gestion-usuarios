from pydantic import BaseModel
from datetime import date

class Empleado(BaseModel):
    id: int
    nombre: str
    fecha_ingres: date  # Cambiando de datetime a date
    puesto: str
    salario_mensual: float


        