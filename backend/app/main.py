from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
import string

app = FastAPI(title="Advanced Random Token Generator API", version="1.2")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Model
class TokenRequest(BaseModel):
    length: int
    uppercase: bool = False
    lowercase: bool = False
    digits: bool = False

# Token Generation Logic
def generate_token(length: int, use_uppercase: bool, use_lowercase: bool, use_digits: bool) -> str:
    char_pool = ''

    if use_uppercase:
        char_pool += string.ascii_uppercase
    if use_lowercase:
        char_pool += string.ascii_lowercase
    if use_digits:
        char_pool += string.digits

    if not char_pool:
        raise ValueError("At least one character type must be selected.")

    token = ''.join(random.choices(char_pool, k=length))
    return token

# API Endpoints
@app.post("/generate-token")
def post_token(request: TokenRequest):
    if request.length <= 0:
        raise HTTPException(status_code=400, detail="Length must be greater than 0.")
    try:
        token = generate_token(request.length, request.uppercase, request.lowercase, request.digits)
        return {"token": token}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))

@app.get("/")
def read_root():
    return {"message": "Welcome to the Advanced Random Token Generator API"}
