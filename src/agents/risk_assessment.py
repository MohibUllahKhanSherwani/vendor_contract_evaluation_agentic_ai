from google.adk.agents import LlmAgent
from google.genai.types import GenerateContentConfig, ThinkingConfig
from src.agents.prompts.prompts_store import RiskAssessmentPrompt
from src.agents.formatters.formatters import RiskAssessmentOutput
from src.configurations.configuration_manager import ConfigurationManager

config = ConfigurationManager()
root_config = config.load_root_config()
llm_config = config.load_llm_config()
content_config = config.load_content_config()

def InitializeRiskAssessmentAgent():
    try:
        agent = LlmAgent(
            name=f"{root_config.app_name}_RiskAssessmentAgent",
            model=llm_config.model_name,
            generate_content_config=GenerateContentConfig(
                max_output_tokens=content_config.max_output_tokens,
                temperature=content_config.temperature,
                thinking_config=ThinkingConfig(
                    include_thoughts=content_config.thinking.include_thoughts,
                    thinking_budget=content_config.thinking.max_output_tokens
                )
            ),
            static_instruction=RiskAssessmentPrompt.STATIC_INSTRUCTIONS,
            output_schema=RiskAssessmentOutput
        )
        return agent
    except Exception as e:
        print(f"Error initializing Risk Assessment Agent: {e}")
        raise e
