"""
Multi-Source Document Loader
Loads contracts, performance data, incidents, market context, and reviews
"""
import csv
import json
from pathlib import Path
from typing import Dict, List, Optional


class DocumentLoader:
    """Loads all data sources for contract reasoning analysis"""
    
    def __init__(self, data_base_path: str = "data"):
        """
        Initialize document loader
        
        Args:
            data_base_path: Base path to data directory
        """
        self.base_path = Path(data_base_path)
        
        # If the data path isn't found in current directory, try project root
        if not self.base_path.exists():
            root_path = Path(__file__).parent.parent.parent
            self.base_path = root_path / data_base_path
    
    def load_contract_bundle(self, contract_id: str) -> Dict:
        """
        Load ALL data sources for a contract
        
        Args:
            contract_id: Contract ID (e.g., "CNT-2024-001")
            
        Returns:
            Dictionary with all available data sources:
            {
                "contract_id": str,
                "performance_history": List[Dict] or None,
                "incidents": List[Dict] or None,
                "market_context": str or None,
                "past_reviews": str or None,
                "data_completeness": float  # 0.0-1.0
            }
        """
        bundle = {
            "contract_id": contract_id,
            "performance_history": None,
            "incidents": None,
            "market_context": None,
            "past_reviews": None
        }
        
        sources_found = 0
        total_sources = 4  # performance, incidents, market, reviews
        
        # 1. Load performance CSV
        try:
            csv_path = self.base_path / "performance" / f"{contract_id}_history.csv"
            if csv_path.exists():
                with open(csv_path, 'r', encoding='utf-8', newline='') as f:
                    bundle["performance_history"] = list(csv.DictReader(f))
                sources_found += 1
        except Exception as e:
            print(f"Warning: Could not load performance data: {e}")
        
        # 2. Load incidents JSON
        try:
            json_path = self.base_path / "incidents" / f"{contract_id}_incidents.json"
            if json_path.exists():
                with open(json_path, 'r', encoding='utf-8') as f:
                    bundle["incidents"] = json.load(f)
                sources_found += 1
        except Exception as e:
            print(f"Warning: Could not load incident data: {e}")
        
        # 3. Load market context (shared across all contracts)
        try:
            market_path = self.base_path / "market" / "industry_benchmarks.txt"
            if market_path.exists():
                bundle["market_context"] = market_path.read_text(encoding='utf-8')
                sources_found += 1
        except Exception as e:
            print(f"Warning: Could not load market context: {e}")
        
        # 4. Load past reviews
        try:
            review_path = self.base_path / "reviews" / f"{contract_id}_reviews.md"
            if review_path.exists():
                bundle["past_reviews"] = review_path.read_text(encoding='utf-8')
                sources_found += 1
        except Exception as e:
            print(f"Warning: Could not load past reviews: {e}")
        
        # Calculate data completeness
        bundle["data_completeness"] = sources_found / total_sources
        
        return bundle
    
    def summarize_performance(self, rows: Optional[List[Dict]]) -> str:
        """
        Convert performance rows to text summary for LLM
        
        Args:
            rows: Performance history rows
            
        Returns:
            Text summary of performance trends
        """
        if not rows:
            return "No performance data available."

        def to_float(value: object, default: float = 0.0) -> float:
            try:
                return float(value)
            except (TypeError, ValueError):
                return default

        def to_int(value: object, default: int = 0) -> int:
            try:
                return int(float(value))
            except (TypeError, ValueError):
                return default
        
        summary = "PERFORMANCE HISTORY (Monthly Data):\n\n"

        # Overall statistics
        uptime_values = [to_float(row.get('uptime_pct')) for row in rows]
        response_values = [to_float(row.get('avg_response_hours')) for row in rows]
        incident_values = [to_int(row.get('incidents_count')) for row in rows]
        critical_values = [to_int(row.get('critical_incidents')) for row in rows]
        satisfaction_values = [to_float(row.get('user_satisfaction')) for row in rows]

        avg_uptime = sum(uptime_values) / len(uptime_values)
        avg_response = sum(response_values) / len(response_values)
        total_incidents = sum(incident_values)
        total_critical = sum(critical_values)
        avg_satisfaction = sum(satisfaction_values) / len(satisfaction_values)
        
        summary += f"Summary Statistics:\n"
        summary += f"- Average Uptime: {avg_uptime:.1f}%\n"
        summary += f"- Average Response Time: {avg_response:.1f} hours\n"
        summary += f"- Total Incidents: {total_incidents}\n"
        summary += f"- Critical Incidents: {total_critical}\n"
        summary += f"- Average User Satisfaction: {avg_satisfaction:.1f}/5.0\n\n"

        # Trend analysis
        if len(rows) >= 2:
            first_uptime = to_float(rows[0].get('uptime_pct'))
            last_uptime = to_float(rows[-1].get('uptime_pct'))
            trend = "IMPROVING" if last_uptime > first_uptime else "DECLINING" if last_uptime < first_uptime else "STABLE"
            summary += f"Trend: {trend} (from {first_uptime:.1f}% to {last_uptime:.1f}%)\n\n"

        # Monthly breakdown
        summary += "Monthly Breakdown:\n"
        for row in rows:
            month = row.get('month', 'Unknown Month')
            uptime = to_float(row.get('uptime_pct'))
            response = to_float(row.get('avg_response_hours'))
            incidents = to_int(row.get('incidents_count'))
            critical = to_int(row.get('critical_incidents'))
            satisfaction = to_float(row.get('user_satisfaction'))

            summary += f"  {month}: "
            summary += f"Uptime {uptime:.1f}%, "
            summary += f"Response {response:.1f}h, "
            summary += f"{incidents} incidents "
            summary += f"({critical} critical), "
            summary += f"Satisfaction {satisfaction:.1f}/5.0\n"

        return summary
    
    def summarize_incidents(self, incidents: Optional[List[Dict]]) -> str:
        """
        Convert incident list to text summary for LLM
        
        Args:
            incidents: List of incident dictionaries
            
        Returns:
            Text summary of incidents with context
        """
        if not incidents:
            return "No incidents recorded."
        
        summary = f"INCIDENT LOG ({len(incidents)} total incidents):\n\n"
        
        # Statistics
        critical = sum(1 for inc in incidents if inc.get('severity') == 'critical')
        high = sum(1 for inc in incidents if inc.get('severity') == 'high')
        medium = sum(1 for inc in incidents if inc.get('severity') == 'medium')
        low = sum(1 for inc in incidents if inc.get('severity') == 'low')
        
        preventable = sum(1 for inc in incidents if inc.get('preventable') == True)
        unresolved = sum(1 for inc in incidents if not inc.get('resolved', True))
        
        summary += f"Severity Breakdown:\n"
        summary += f"- Critical: {critical}\n"
        summary += f"- High: {high}\n"
        summary += f"- Medium: {medium}\n"
        summary += f"- Low: {low}\n\n"
        
        summary += f"Analysis:\n"
        summary += f"- Preventable Incidents: {preventable}/{len(incidents)}\n"
        summary += f"- Unresolved Incidents: {unresolved}\n\n"
        
        # Detailed breakdown
        summary += "Detailed Incident History:\n"
        for inc in incidents:
            summary += f"\n[{inc['date']}] {inc['severity'].upper()}: {inc['title']}\n"
            summary += f"  Description: {inc['description']}\n"
            summary += f"  Root Cause: {inc.get('root_cause', 'Unknown')}\n"
            summary += f"  Resolution Time: {inc.get('resolution_hours', 'N/A')} hours\n"
            summary += f"  Preventable: {inc.get('preventable', 'Unknown')}\n"
            summary += f"  Vendor Response: {inc.get('vendor_response_quality', 'Not rated')}\n"
            summary += f"  Business Impact: {inc.get('business_impact', 'Not specified')}\n"
        
        return summary
    
    def extract_review_summary(self, review_text: Optional[str]) -> str:
        """
        Extract key points from past human review
        
        Args:
            review_text: Full review markdown text
            
        Returns:
            Condensed summary of key points
        """
        if not review_text:
            return "No past human reviews available."
        
        # For now, return first 3000 characters (enough for LLM context)
        # Could implement smarter extraction later
        if len(review_text) > 3000:
            return review_text[:3000] + "\n\n[Review truncated for length...]"
        return review_text
