import os
import csv
import yaml
import logging
from pathlib import Path
from typing import Dict
from datetime import datetime
from passlib.context import CryptContext
from logging.handlers import RotatingFileHandler

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
# ─── YAML Loader ──────────────────────────────────────────────────────────────

def load_yaml(path: Path) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


# ─── Logger ───────────────────────────────────────────────────────────────────

def setup_logger(
    name: str = "agent_logger",
    log_file: str = os.path.join(os.getcwd(), "app.log"),
    level: int = logging.INFO,
):
    log_path = Path(log_file)
    log_path.parent.mkdir(parents=True, exist_ok=True)
    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)s | %(name)s | %(filename)s:%(lineno)d | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    file_handler = RotatingFileHandler(
        log_file,
        maxBytes=5 * 1024 * 1024,
        backupCount=5,
        encoding="utf-8",
    )
    file_handler.setFormatter(formatter)

    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)

    root_logger = logging.getLogger()
    root_logger.setLevel(level)

    if not root_logger.handlers:
        root_logger.addHandler(file_handler)
        root_logger.addHandler(console_handler)

    return root_logger

logger = setup_logger()


# ─── Session Management ──────────────────────────────────────────────────────

class SessionNotFoundError(Exception):
    pass

async def ensure_session(user_id: str, session_id: str, session_service, app_name: str):
    session = await session_service.get_session(app_name=app_name, user_id=user_id, session_id=session_id)
    if session is None:
        logger.info("Creating New Session")
        session = await session_service.create_session(
            session_id=session_id,
            user_id=user_id,
            app_name=app_name
        )
    else:
        logger.info("Session Already Exists")
    return session


# ─── Auth Helpers ────────────────────────────────────────────────────────────

def hash_password(password: str) -> str:
    """Hash a password using argon2."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed one using argon2."""
    return pwd_context.verify(plain_password, hashed_password)

def format_error_message(e: Exception) -> str:
    """Format an exception into a user-friendly error message."""
    error_str = str(e)
    if "429" in error_str or "quota" in error_str.lower():
        return "Model quota exceeded. Please try again later or contact support."
    if "auth" in error_str.lower() or "api key" in error_str.lower():
        return "Authentication error with the AI provider. Please check configuration."
    return f"An unexpected error occurred: {error_str}"
