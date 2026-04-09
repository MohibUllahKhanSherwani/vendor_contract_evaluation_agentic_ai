from pathlib import Path
from src.configurations.configuration_manager import ConfigurationManager
from src.data_sources.local_data_source import LocalDataSource
from src.data_sources.mongo_data_source import MongoDataSource
from src.data_sources.base_data_source import BaseDataSource

def get_data_source() -> BaseDataSource:
    config_manager = ConfigurationManager()
    data_config = config_manager.load_data_config()
    
    if data_config.source_type == "mongo" and data_config.mongo_uri and data_config.db_name:
        return MongoDataSource(data_config.mongo_uri, data_config.db_name)
    
    base_dir = Path(__file__).resolve().parents[2]
    return LocalDataSource(base_dir)
