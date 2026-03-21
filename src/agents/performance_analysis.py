from google.adk.agents import LlmAgent
from google.genai.types import GenerateContentConfig, ThinkingConfig
from src.agents.prompts.prompts_store import PerformanceAnalysisPrompt
from src.agents.formatters.formatters import PerformanceAnalysisOutput
from src.configurations.configuration_manager import ConfigurationManager

config = ConfigurationManager()
root_config = config.load_root_config()
llm_config = config.load_llm_config()
content_config = config.load_content_config()

def InitializePerformanceAnalysisAgent():
    try:
        agent = LlmAgent(
            name=f"{root_config.app_name}_PerformanceAnalysisAgent",
            model=llm_config.model_name,
            generate_content_config=GenerateContentConfig(
                max_output_tokens=content_config.max_output_tokens,
                temperature=content_config.temperature,
                thinking_config=ThinkingConfig(
                    include_thoughts=content_config.thinking.include_thoughts,
                    thinking_budget=content_config.thinking.max_output_tokens
                )
            ),
            static_instruction=PerformanceAnalysisPrompt.STATIC_INSTRUCTIONS,
            output_schema=PerformanceAnalysisOutput
        )
        return agent
    except Exception as e:
        print(f"Error initializing Performance Analysis Agent: {e}")
        raise e
