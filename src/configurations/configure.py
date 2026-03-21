from pydantic import BaseModel 
from typing import List

class RootConfigs:
    class Root(BaseModel):
        app_name: str
    
    class ConversationConfig(BaseModel):
        conversational_history_db: str
    
    class ThinkingConfig(BaseModel):
        max_output_tokens: int
        include_thoughts: bool
    
    class ContentConfig(BaseModel):
        max_output_tokens: int
        temperature: float
        thinking: "RootConfigs.ThinkingConfig"

    class LLmConfig(BaseModel):
        model_name: str
        description: str
        api_keys: List[str]
    
    class SessionConfig(BaseModel):
        max_messages: int
