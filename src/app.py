from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import json
import sys
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

sys.path.insert(0, str(Path(__file__).parent.parent))

from src.agents import DataIntakeAgent
from src.Controllers.AuthController import router as auth_router
from src.DTOs.EvaluationDTO import EvaluationRequest, EvaluationResponse

app = FastAPI(
    title="Contract Evaluation Hub API",
    description="Agentic AI system for automated contract performance evaluation",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["Auth"])

data_intake = DataIntakeAgent()
evaluation_results: Dict[str, dict] = {}

class DataConfigRequest(BaseModel):
    source_type: str
    mongo_uri: str
    db_name: str

@app.post("/config/data-source", status_code=status.HTTP_200_OK)
async def update_data_source(request: DataConfigRequest):
    try:
        from src.configurations.configuration_manager import ConfigurationManager
        config_manager = ConfigurationManager()
        config_manager.update_data_config(
            request.source_type, 
            request.mongo_uri, 
            request.db_name
        )
        
        evaluation_results.clear()
        
        return {"status": "success", "message": "Data source configuration updated."}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

SAMPLE_VENDORS = {
    "vendor_abc_it_solutions": {"file": "data/samples/vendor_abc_it_solutions.json"},
    "vendor_gulf_pipeline": {"file": "data/samples/vendor_gulf_pipeline.json"},
    "vendor_desert_drilling": {"file": "data/samples/vendor_desert_drilling.json"},
    "vendor_sahara_oilfield": {"file": "data/samples/vendor_sahara_oilfield.json"},
    "vendor_petro_logistics": {"file": "data/samples/vendor_petro_logistics.json"},
}

@app.get("/")
def root():
    return {
        "name": "Contract Evaluation Hub API",
        "version": "0.1.0",
        "status": "operational"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "agents": {
            "data_intake": "operational",
            "performance": "operational",
            "risk": "operational",
            "reasoning": "operational"
        }
    }

@app.post("/evaluate", response_model=EvaluationResponse, status_code=status.HTTP_200_OK)
async def evaluate_contract(request: EvaluationRequest):
    if request.contract_data:
        contract = request.contract_data
    elif request.contract_file:
        contract_path = Path(request.contract_file)
        if not contract_path.exists():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Contract file not found: {request.contract_file}"
            )
        with open(contract_path, 'r', encoding='utf-8') as f:
            contract = json.load(f)
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Must provide either contract_data or contract_file"
        )
    
    if contract.get("contract_id") != request.contract_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Contract ID mismatch"
        )
    
    try:
        import uuid
        from src.executor import evaluate_contract_flow
        session_id = str(uuid.uuid4())
        user_id = "test_user"
        
        result = await evaluate_contract_flow(session_id, user_id, contract)
        evaluation_results[result.get("contract_id", "")] = result
        
        return EvaluationResponse(
            contract_id=result.get("contract_id", ""),
            vendor_name=result.get("vendor_name", ""),
            status=result.get("status", "completed"),
            performance_score=result.get("performance_score"),
            grade=result.get("grade"),
            risk_level=result.get("risk_level"),
            recommendation=result.get("recommendation"),
            timestamp=result.get("timestamp", ""),
            reasoning_chain=result.get("reasoning_chain"),
            justification=result.get("justification"),
            confidence_level=result.get("confidence_level")
        )
    except Exception as e:
        from src.utils.utilities import format_error_message
        friendly_msg = format_error_message(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=friendly_msg
        )

@app.get("/vendors")
def list_vendors():
    from src.data_sources.factory import get_data_source
    data_source = get_data_source()
    all_contracts = data_source.list_contracts()
    
    vendors = []
    for contract in all_contracts:
        contract_id = contract.get("contract_id", "")
        if contract_id in evaluation_results:
            vendors.append(evaluation_results[contract_id])
        else:
            vendors.append({
                "contract_id": contract_id,
                "vendor_name": contract.get("vendor_name", "Unknown"),
                "status": "pending",
                "sample_key": contract.get("sample_key", "unknown")
            })
    return {"count": len(vendors), "vendors": vendors}

@app.get("/results/{contract_id}")
def get_result(contract_id: str):
    result = evaluation_results.get(contract_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No evaluation found for contract {contract_id}"
        )
    return result

@app.get("/results")
def list_results():
    results = list(evaluation_results.values())
    return {
        "count": len(results),
        "results": results
    }

@app.post("/evaluate-sample/{sample_name}")
async def evaluate_sample(sample_name: str):
    from src.data_sources.factory import get_data_source
    data_source = get_data_source()
    all_contracts = data_source.list_contracts()

    # 1. Try to find in the dynamic contracts (e.g., MongoDB or Local registry)
    contract = next((c for c in all_contracts if c.get("sample_key") == sample_name), None)
    
    # 2. Fallback to hardcoded shorthands and local files if not found
    if not contract:
        shorthands = {
            "abc": "vendor_abc_it_solutions",
            "xyz": "vendor_xyz_tech",
            "problematic": "vendor_problematic_corp",
            "drilling": "vendor_desert_drilling",
            "pipeline": "vendor_gulf_pipeline",
            "chemicals": "vendor_sahara_oilfield",
            "logistics": "vendor_petro_logistics",
            "hse": "vendor_apex_hse"
        }
        
        sample_key = sample_name.lower()
        if sample_key in shorthands:
            sample_key = shorthands[sample_key]
            
        sample_info = SAMPLE_VENDORS.get(sample_key)
        if not sample_info:
            available = [c.get("sample_key") for c in all_contracts if c.get("sample_key")] + list(SAMPLE_VENDORS.keys()) + list(shorthands.keys())
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Unknown sample: {sample_name}. Available: {', '.join(available)}"
            )

        contract_file = sample_info["file"]
        contract_file_path = Path(contract_file)
        if not contract_file_path.exists():
            root_path = Path(__file__).parent.parent
            contract_file_path = root_path / contract_file
            
        if not contract_file_path.exists():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Contract file not found: {contract_file_path}"
            )
        
        with open(contract_file_path, 'r', encoding='utf-8') as f:
            contract = json.load(f)
    
    # Run the evaluation with whatever contract data we found
    request = EvaluationRequest(
        contract_id=contract["contract_id"],
        contract_data=contract
    )
    return await evaluate_contract(request)

if __name__ == "__main__":
    import uvicorn
    print("Starting Contract Evaluation Hub API...")
    print("API Documentation: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
