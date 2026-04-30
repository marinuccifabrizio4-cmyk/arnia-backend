from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# abilita richieste dal frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# "database" temporaneo
db = []

# struttura dati
class SensorData(BaseModel):
    temperature: float
    humidity: float
    weight: float
    timestamp: float

# riceve dati dal simulatore / sensore
@app.post("/data")
def receive_data(data: SensorData):
    db.append(data.dict())
    return {"status": "ok"}

# manda dati al frontend
@app.get("/data")
def get_data():
    return db[-50:]  # ultimi 50 dati