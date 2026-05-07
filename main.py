from fastapi import FastAPI, BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB
db = []

# modello dati
class SensorData(BaseModel):
    temperature: float
    humidity: float
    weight: float
    timestamp: float

# POST dati
@app.post("/data")
def receive_data(data: SensorData):
    db.append(data.dict())
    return {"status": "ok"}

# GET dati
@app.get("/data")
def get_data():
    return db[-50:]

# 👇 SERVE HTML DA templates SENZA JINJA
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@app.get("/")
def home():
    return FileResponse(os.path.join(BASE_DIR, "templates", "index.html"))

# static files
app.mount(
    "/static",
    StaticFiles(directory=os.path.join(BASE_DIR, "static")),
    name="static"
)
