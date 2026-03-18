import os
import csv
import yaml
import logging
from pathlib import Path
from typing import Dict
from datetime import datetime
from logging.handlers import RotatingFileHandler


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


# ─── CSV Output Handler ──────────────────────────────────────────────────────

class CSVOutputHandler:

    def __init__(self, csv_path: str = "data/evaluations.csv"):
        self.csv_path = Path(csv_path)
        self.fieldnames = [
            "timestamp",
            "contract_id",
            "vendor_name",
            "performance_score",
            "grade",
            "risk_level",
            "recommendation",
            "status",
            "justification",
            "confidence_level"
        ]
        self.csv_path.parent.mkdir(parents=True, exist_ok=True)

    def save_result(self, result: Dict) -> None:
        results = self.read_results()
        contract_id = result.get("contract_id", "")

        row = {
            "timestamp": result.get("timestamp", datetime.utcnow().isoformat() + "Z"),
            "contract_id": contract_id,
            "vendor_name": result.get("vendor_name", ""),
            "performance_score": result.get("performance_score", 0),
            "grade": result.get("grade", ""),
            "risk_level": result.get("risk_level", ""),
            "recommendation": result.get("recommendation", ""),
            "status": result.get("status", ""),
            "justification": result.get("justification", ""),
            "confidence_level": result.get("confidence_level", "")
        }

        updated = False
        for i, existing in enumerate(results):
            if existing.get("contract_id") == contract_id:
                results[i] = row
                updated = True
                break

        if not updated:
            results.append(row)

        with open(self.csv_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=self.fieldnames)
            writer.writeheader()
            writer.writerows(results)

    def read_results(self) -> list:
        if not self.csv_path.exists():
            return []

        results = []
        with open(self.csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                results.append(dict(row))

        return results

    def get_by_contract_id(self, contract_id: str) -> Dict:
        results = self.read_results()
        for result in results:
            if result.get("contract_id") == contract_id:
                return result
        return None
