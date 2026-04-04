from fastapi import APIRouter, HTTPException
from src.Services.AuthService import AuthService
from src.DTOs.AuthDTO import RegisterRequest, LoginRequest

router = APIRouter()
auth_service = AuthService()

@router.post("/register")
async def register(data: RegisterRequest):
    result = await auth_service.register_user(data.username, data.email, data.password)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@router.post("/login")
async def login(data: LoginRequest):
    result = await auth_service.login_user(data.email, data.password)
    if not result["success"]:
        raise HTTPException(status_code=401, detail=result["message"])
    return result
