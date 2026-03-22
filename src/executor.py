import json
import asyncio
from pathlib import Path
from datetime import datetime
import os

from google.adk.runners import Runner
from google.adk.sessions.database_session_service import DatabaseSessionService
from google.genai.types import Content, Part

from src.agents.performance_analysis import InitializePerformanceAnalysisAgent
from src.agents.risk_assessment import InitializeRiskAssessmentAgent
from src.agents.reasoning_agent import InitializeReasoningAgent
from src.configurations.configuration_manager import ConfigurationManager
from src.utils.utilities import ensure_session, logger

config = ConfigurationManager()
root_config = config.load_root_config()
conversational_config = config.load_conversation_config()
llm_config = config.load_llm_config()

base_dir = Path(__file__).resolve().parent.parent
db_path_obj = Path(conversational_config.conversational_history_db)
if not db_path_obj.is_absolute():
    db_path_obj = base_dir / db_path_obj

db_path_obj.parent.mkdir(parents=True, exist_ok=True)

db_path_str = f"sqlite+aiosqlite:///{db_path_obj}?timeout=60"
session_service = DatabaseSessionService(db_url=db_path_str)

def initialize_runner(agent):
    return Runner(
        session_service=session_service,
        agent=agent,
        app_name=root_config.app_name
    )

async def evaluate_contract_flow(session_id: str, user_id: str, contract_data: dict) -> dict:
    result = {
        "contract_id": contract_data.get("contract_id", "unknown"),
        "vendor_name": contract_data.get("vendor_name", "unknown"),
        "status": "completed",
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }
    async def run_agent(agent_init_func, input_text: str):
        last_exception = None
        
        for api_key_name in llm_config.api_keys:
            api_key = os.getenv(api_key_name)
            if not api_key:
                logger.error(f"API key {api_key_name} not found. Skipping...")
                continue
                
            os.environ["GOOGLE_API_KEY"] = api_key
            logger.info(f"Rotating to API key: {api_key_name}")
            
            try:
                agent = agent_init_func()
                step_session_id = f"{session_id}_{agent.name}"
                
                await ensure_session(
                    user_id=user_id, 
                    session_id=step_session_id, 
                    session_service=session_service, 
                    app_name=root_config.app_name
                )
                
                runner = initialize_runner(agent)
                content = Content(role="user", parts=[Part(text=input_text)])
                
                final_text = None
                usage = {"input": 0, "output": 0, "total": 0}
                
                logger.info(f"Executing {agent.name}...")
                
                for event in runner.run(user_id=user_id, session_id=step_session_id, new_message=content):
                    if hasattr(event, "usage_metadata") and event.usage_metadata:
                        usage["input"] = max(usage["input"], event.usage_metadata.prompt_token_count or 0)
                        usage["output"] = max(usage["output"], event.usage_metadata.candidates_token_count or 0)
                        usage["total"] = max(usage["total"], event.usage_metadata.total_token_count or 0)
                    
                    if event.is_final_response() and event.content:
                        for part in event.content.parts:
                            if not getattr(part, "thought", False):
                                final_text = part.text
                
                if final_text:
                    logger.info(f"Execution of {agent.name} finished successfully.")
                    return json.loads(final_text), usage
                
            except Exception as e:
                error_msg = str(e).lower()
                if any(k in error_msg for k in ["429", "quota", "exhausted", "limit"]):
                    logger.warning(f"Quota hit on {api_key_name}. Trying next key...")
                    last_exception = e
                    continue # Rotate to next key
                else:
                    logger.error(f"Non-quota error in {agent.name}: {e}")
                    raise e
        
        if last_exception:
            raise last_exception
        raise Exception("Failed to execute agent: No valid API keys available.")
    context = {
        "market_benchmarks": "No benchmark data found.",
        "performance_history": "No historical performance data found.",
        "past_reviews": "No past reviews found.",
        "detailed_incidents": "No detailed incident reports found."
    }
    
    total_usage = {"input": 0, "output": 0, "total": 0}
    
    try:
        dept = contract_data.get("department", "Unknown")
        market_path = base_dir / "data" / "market" / f"benchmarks_{dept}.txt"
        
        if market_path.exists():
            context["market_benchmarks"] = market_path.read_text(encoding='utf-8')
        else:
            context["market_benchmarks"] = (
                f"WARNING: Specific industry benchmarks for department '{dept}' were NOT FOUND. "
                "Analysis must be conducted using only the contract data provided. "
                "Confidence in benchmarking context is LOW."
            )
            
        contract_id = result["contract_id"]
        
        perf_hist_path = base_dir / "data" / "performance" / f"{contract_id}_history.csv"
        if perf_hist_path.exists():
            context["performance_history"] = perf_hist_path.read_text(encoding='utf-8')
            
        reviews_path = base_dir / "data" / "reviews" / f"{contract_id}_reviews.md"
        if reviews_path.exists():
            context["past_reviews"] = reviews_path.read_text(encoding='utf-8')
            
        incidents_path = base_dir / "data" / "incidents" / f"{contract_id}_incidents.json"
        if incidents_path.exists():
            context["detailed_incidents"] = incidents_path.read_text(encoding='utf-8')
            
    except Exception as e:
        print(f"Warning: Error loading auxiliary data for {result['contract_id']}: {e}")

    try:
        perf_payload = json.dumps({
            "contract": contract_data,
            "history": context["performance_history"]
        })
        perf_result, usage1 = await run_agent(InitializePerformanceAnalysisAgent, perf_payload)
        for k in total_usage: total_usage[k] += usage1[k]
        
        if perf_result:
            result["performance_score"] = perf_result.get("overall_score")
            result["grade"] = perf_result.get("grade")
        
        risk_payload = json.dumps({
            "contract": contract_data, 
            "performance_score": result.get("performance_score"),
            "incidents_detail": context["detailed_incidents"]
        })
        risk_result, usage2 = await run_agent(InitializeRiskAssessmentAgent, risk_payload)
        for k in total_usage: total_usage[k] += usage2[k]
        
        if risk_result:
            result["risk_level"] = risk_result.get("risk_level")
        
        reasoning_payload = json.dumps({
            "contract": contract_data,
            "performance": perf_result,
            "risk": risk_result,
            "market_context": context["market_benchmarks"],
            "past_reviews": context["past_reviews"]
        })
        reasoning_result, usage3 = await run_agent(InitializeReasoningAgent, reasoning_payload)
        for k in total_usage: total_usage[k] += usage3[k]
        
        if reasoning_result:
            result["recommendation"] = reasoning_result.get("recommendation")
            result["reasoning_chain"] = reasoning_result.get("reasoning_chain")
            result["justification"] = reasoning_result.get("justification")
            result["confidence_level"] = reasoning_result.get("confidence_level")
        
        result["metadata"] = {
            "token_usage": total_usage
        }
        
        logger.info(f"[TOKEN USAGE REPORT] Evaluation for {result['vendor_name']} (ID: {result['contract_id']})")
        logger.info(f"   Input Tokens:     {total_usage['input']}")
        logger.info(f"   Output Tokens:    {total_usage['output']}")
        logger.info(f"   Total Tokens:     {total_usage['total']}")
            
    except Exception as e:
        logger.error(f"Error in evaluate_contract_flow: {e}")
        result["status"] = "error"
        result["justification"] = f"Evaluation failed: {str(e)}"
        
    return result
