from pydantic import BaseModel
from typing import Dict, List, Optional

class EvaluationRequest(BaseModel):
    contract_id: str
    contract_file: Optional[str] = None
    contract_data: Optional[Dict] = None

class EvaluationResponse(BaseModel):
    contract_id: str
    vendor_name: str
    status: str
    performance_score: Optional[float] = None
    grade: Optional[str] = None
    risk_level: Optional[str] = None
    recommendation: Optional[str] = None
    timestamp: Optional[str] = None
    reasoning_chain: Optional[List[str]] = None
    justification: Optional[str] = None
    confidence_level: Optional[str] = None
