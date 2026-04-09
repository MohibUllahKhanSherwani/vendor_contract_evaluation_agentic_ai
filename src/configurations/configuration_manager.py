from src.configurations.configure import RootConfigs
from src.utils.utilities import load_yaml
from pathlib import Path

class ConfigurationManager:

    def __init__(self):
        base_dir = Path(__file__).resolve().parents[2]
        self.config_file_path = base_dir / "config.yaml"
        self.config = load_yaml(self.config_file_path)

    def load_root_config(self) -> RootConfigs.Root:
        return RootConfigs.Root(**self.config["Root"])

    def load_conversation_config(self) -> RootConfigs.ConversationConfig:
        return RootConfigs.ConversationConfig(**self.config["ConversationConfig"])

    def load_content_config(self) -> RootConfigs.ContentConfig:
        thinking_cfg = RootConfigs.ThinkingConfig(
            **self.config["ContentConfig"]["thinking"]
        )
        return RootConfigs.ContentConfig(
            max_output_tokens=self.config["ContentConfig"]["max_output_tokens"],
            temperature=self.config["ContentConfig"]["temperature"],
            thinking=thinking_cfg
        )

    def load_llm_config(self) -> RootConfigs.LLmConfig:
        return RootConfigs.LLmConfig(**self.config["LLmConfig"])

    def load_session_config(self) -> RootConfigs.SessionConfig:
        return RootConfigs.SessionConfig(**self.config["SessionConfig"])

    def load_data_config(self) -> RootConfigs.DataConfig:
        data_section = self.config.get("DataConfig", {})
        return RootConfigs.DataConfig(**data_section)

    def update_data_config(self, source_type: str, mongo_uri: str, db_name: str):
        """Updates the data configuration and saves it back to the config object."""
        self.config["DataConfig"] = {
            "source_type": source_type,
            "mongo_uri": mongo_uri,
            "db_name": db_name
        }
        
        # Write back to config.yaml so other instances pick it up
        import yaml
        with open(self.config_file_path, 'r', encoding='utf-8') as f:
            full_config = yaml.safe_load(f) or {}
            
        full_config["DataConfig"] = self.config["DataConfig"]
        
        with open(self.config_file_path, 'w', encoding='utf-8') as f:
            yaml.dump(full_config, f, default_flow_style=False, sort_keys=False)
