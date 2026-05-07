from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from pydantic import BaseModel

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# cartelle frontend
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# database temporaneo
db = []

# modello dati
class SensorData(BaseModel):
    temperature: float
    humidity: float
    weight: float
    timestamp: float

# homepage
@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {"request": request}
    )
# riceve dati
@app.post("/data")
def receive_data(data: SensorData):
    db.append(data.dict())
    return {"status": "ok"}

# manda dati
@app.get("/data")
def get_data():
    return db[-50:]
