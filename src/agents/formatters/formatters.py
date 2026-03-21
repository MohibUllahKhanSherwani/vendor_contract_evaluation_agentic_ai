from pydantic import BaseModel, Field
from typing import List

class KPIScoreOutput(BaseModel):
    kpi_name: str
    target: float
    actual: float
    unit: str
    score: float
    compliance: str
    reason: str

class PerformanceAnalysisOutput(BaseModel):
    overall_score: float = Field(description="The calculated overall score from 0 to 100.")
    grade: str = Field(description="The assigned letter grade (A, B, C, D, or F).")
    kpi_scores: List[KPIScoreOutput] = Field(description="List of calculated KPI scores.")
    justification: str = Field(description="A 1-2 sentence performance summary explaining the overall performance.")

class RiskMetricsOutput(BaseModel):
    performance_score: float
    critical_incidents: int
    total_incidents: int
    unresolved_incidents: int
    budget_overrun_pct: float

class RiskAssessmentOutput(BaseModel):
    risk_level: str = Field(description="Classified risk level: LOW, MEDIUM, or HIGH.")
    recommendation: str = Field(description="Recommendation for action: RENEW, MONITOR, RENEGOTIATE, or TERMINATE.")
    reason: str = Field(description="A single sentence explaining why this vendor is classified at the assigned risk level.")
    risk_factors: List[str] = Field(description="List of bullet points describing the specific risk factors.")
    metrics: RiskMetricsOutput = Field(description="The metrics evaluated.")

class ReasoningOutput(BaseModel):
    reasoning_chain: List[str] = Field(description="Exactly 5 steps summarized briefly (max 50 words per step): 1. Performance Trends, 2. Incident Patterns, 3. Context, 4. Trade-offs, 5. Recommendation Justification.")
    performance_assessment: str = Field(description="Written assessment of performance.")
    risk_factors: List[str] = Field(description="Key risk factors identified.")
    strengths: List[str] = Field(description="Key strengths identified.")
    recommendation: str = Field(description="Final recommendation: RENEW, TERMINATE, RENEGOTIATE, or MONITOR.")
    confidence_level: str = Field(description="Confidence level: HIGH, MEDIUM, LOW.")
    justification: str = Field(description="Detailed justification written as a human analyst. Cite specific data points and figures. Do NOT reference 'mandatory rules', 'decision framework', or any internal scoring thresholds — just explain why this is the right call based on the evidence.")
    alternative_consideration: str = Field(description="Alternative options considered, written naturally. Do not reference internal rules or frameworks.")
