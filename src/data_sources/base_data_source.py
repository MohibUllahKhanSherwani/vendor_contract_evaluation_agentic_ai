from abc import ABC, abstractmethod

class BaseDataSource(ABC):
    @abstractmethod
    def get_market_benchmarks(self, department: str) -> str:
        pass

    @abstractmethod
    def get_performance_history(self, contract_id: str) -> str:
        pass

    @abstractmethod
    def get_past_reviews(self, contract_id: str) -> str:
        pass

    @abstractmethod
    def get_detailed_incidents(self, contract_id: str) -> str:
        pass

    @abstractmethod
    def list_contracts(self) -> list:
        """
        Lists all available contracts/vendors.
        """
        pass
