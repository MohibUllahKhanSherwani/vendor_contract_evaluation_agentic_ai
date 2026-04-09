from pathlib import Path
from src.data_sources.base_data_source import BaseDataSource

class LocalDataSource(BaseDataSource):
    def __init__(self, base_dir: Path):
        self.base_dir = base_dir

    def get_market_benchmarks(self, department: str) -> str:
        market_path = self.base_dir / "data" / "market" / f"benchmarks_{department}.txt"
        if market_path.exists():
            return market_path.read_text(encoding='utf-8')
        return (
            f"WARNING: Specific industry benchmarks for department '{department}' were NOT FOUND. "
            "Analysis must be conducted using only the contract data provided. "
            "Confidence in benchmarking context is LOW."
        )
    def get_performance_history(self, contract_id: str) -> str:
        perf_hist_path = self.base_dir / "data" / "performance" / f"{contract_id}_history.csv"
        if perf_hist_path.exists():
            return perf_hist_path.read_text(encoding='utf-8')
        return "No historical performance data found."

    def get_past_reviews(self, contract_id: str) -> str:
        reviews_path = self.base_dir / "data" / "reviews" / f"{contract_id}_reviews.md"
        if reviews_path.exists():
            return reviews_path.read_text(encoding='utf-8')
        return "No past reviews found."
    def get_detailed_incidents(self, contract_id: str) -> str:
        incidents_path = self.base_dir / "data" / "incidents" / f"{contract_id}_incidents.json"
        if incidents_path.exists():
            return incidents_path.read_text(encoding='utf-8')
        return "No detailed incident reports found."

    def list_contracts(self) -> list:
        import json
        SAMPLE_VENDORS = {
            "vendor_abc_it_solutions": {"file": "data/samples/vendor_abc_it_solutions.json"},
            "vendor_gulf_pipeline": {"file": "data/samples/vendor_gulf_pipeline.json"},
            "vendor_desert_drilling": {"file": "data/samples/vendor_desert_drilling.json"},
            "vendor_sahara_oilfield": {"file": "data/samples/vendor_sahara_oilfield.json"},
            "vendor_petro_logistics": {"file": "data/samples/vendor_petro_logistics.json"},
        }
        contracts = []
        for sample_key, sample_info in SAMPLE_VENDORS.items():
            file_path = self.base_dir / sample_info["file"]
            if file_path.exists():
                with open(file_path, 'r', encoding='utf-8') as f:
                    contract = json.load(f)
                contract["sample_key"] = sample_key
                contracts.append(contract)
        return contracts