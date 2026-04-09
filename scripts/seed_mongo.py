import os
import json
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI_SECONDARY")
DB_NAME = "contactdata" # Using the cluster name as requested

def seed_data():
    if not MONGO_URI or "<dbAdmin>" in MONGO_URI:
        print("❌ Error: MONGO_URI_SECONDARY is not set or still contains placeholders in .env!")
        return
    
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    
    print(f"Connecting to database: {DB_NAME}...")

    # 1. Market Benchmarks (Expanded)
    market_data = [
        {
            "department": "Drilling",
            "content": """# Offshore Drilling Services - Industry Benchmarks (2024)
- **Top Tier ROP**: 45+ ft/hr
- **Average NPT**: < 5%
- **Safety Standard**: TRIR < 0.45"""
        },
        {
            "department": "Pipeline",
            "content": """# Pipeline Infrastructure - Industry Benchmarks (2024)
- **Average Repair Rate**: 1.8% to 2.5%
- **Progress Rate**: 1.5 - 2.2 km/day
- **Testing Compliance**: 100% pass rate"""
        },
        {
            "department": "IT",
            "content": """# Enterprise IT Services - Industry Benchmarks (2024)
- **Uptime SLA**: 99.9% availability
- **Response Time**: < 15 mins for Priority 1
- **Security Compliance**: ISO 27001 required"""
        },
        {
            "department": "Logistics",
            "content": """# Oilfield Logistics - Industry Benchmarks (2024)
- **On-Time Delivery**: > 98%
- **Fleet Uptime**: > 95%
- **Safety Standard**: Zero recordable vehicle incidents"""
        },
        {
            "department": "HSE",
            "content": """# HSE Consulting Services - Industry Benchmarks (2024)
- **Reporting Accuracy**: 100%
- **Regulatory Compliance**: Zero non-conformity findings
- **Audit Completion**: 100% as per schedule"""
        }
    ]

    # 2. Performance History (Expanded CSV)
    performance_data = [
        {
            "contract_id": "CNT-OG-001",
            "content": """Date,Metric,Value,Target,Status,Notes
2024-01-01,ROP,32,40,Below Target,Poor formation management
2024-02-01,NPT,12.5,5.0,Below Target,Multiple hydraulic failures
2024-03-01,TRIR,0.65,0.45,Below Target,Three near-misses in one week"""
        },
        {
            "contract_id": "CNT-OG-002",
            "content": """Date,Metric,Value,Target,Status,Notes
2024-01-01,Weld Repair Rate,1.2,2.0,Above Target,Smooth operations
2024-02-01,Progress Rate,1.7,1.8,Meeting,Standard performance
2024-03-01,Safety Incidents,1,0,Below Target,Minor cut on site"""
        },
        {
            "contract_id": "CNT-IT-001",
            "content": """Date,Metric,Value,Target,Status,Notes
2024-01-01,Uptime,99.99,99.9,Above Target,Perfect uptime
2024-02-01,Change Success,100%,98%,Above Target,Stable environment
2024-03-01,P1 Response,5 min,15 min,Above Target,Instant resolution"""
        },
        {
            "contract_id": "CNT-LOG-001",
            "content": """Date,Metric,Value,Target,Status,Notes
2024-01-01,On-Time Delivery,99.5,98.0,Above Target,Exceeding expectations
2024-02-01,Fleet Uptime,97.2,95.0,Above Target,New maintenance schedule
2024-03-01,Safety incidents,0,0,Meeting,Zero incidents reported"""
        },
        {
            "contract_id": "CNT-HSE-001",
            "content": """Date,Metric,Value,Target,Status,Notes
2024-01-01,Audit Completion,85%,100%,Below Target,Staffing shortage
2024-02-01,Compliance findings,4,0,Below Target,Missed regulatory filings
2024-03-01,Reporting Late,7,0,Below Target,Consistent reporting delays"""
        }
    ]

    # 3. Reviews (Expanded Markdown)
    reviews_data = [
        {
            "contract_id": "CNT-OG-001",
            "content": """# Performance Review: Petro-Drill Solutions (Q1 2024)
## HIGH RISK WARNING
Operational performance is declining. Frequent equipment failures and a spike in near-misses indicate systemic issues in their maintenance and safety culture."""
        },
        {
            "contract_id": "CNT-OG-002",
            "content": """# Performance Review: Gulf Pipelines Corp (Q1 2024)
## MEDIUM RISK
Consistent construction speed, but one minor safety incident and slightly delayed documentation prevent a low-risk rating."""
        },
        {
            "contract_id": "CNT-IT-001",
            "content": """# Performance Review: SafeNet IT Services (Q1 2024)
## LOW RISK
Exceptional reliability. Zero downtime and proactive security monitoring make them a highly stable partner."""
        },
        {
            "contract_id": "CNT-LOG-001",
            "content": """# Performance Review: Global Logistics Ltd (Q1 2024)
## LOW RISK
Highly reliable logistics partner. Zero safety incidents and 99.5% on-time delivery record across the desert operations."""
        },
        {
            "contract_id": "CNT-HSE-001",
            "content": """# Performance Review: Apex HSE Consulting (Q1 2024)
## SEVERE RISK
Failure to meet basic regulatory reporting deadlines. Multiple non-conformity findings and a critical lack of qualified staff on-site."""
        }
    ]

    # 4. Incidents (Expanded JSON)
    incidents_data = [
        {
            "contract_id": "CNT-OG-001",
            "incidents": [
                {
                    "date": "2024-03-10",
                    "severity": "High",
                    "description": "Critical failure in blowout preventer during test.",
                    "impact": "2 days of total downtime.",
                    "resolution": "Partially repaired, awaiting manufacture parts."
                },
                {
                    "date": "2024-03-25",
                    "severity": "High",
                    "description": "Near-miss incident involving heavy lift cable snap.",
                    "impact": "Work halted indefinitely for investigation.",
                    "resolution": "Investigation ongoing, vendor blame-shifting."
                }
            ]
        },
        {
            "contract_id": "CNT-OG-002",
            "incidents": [
                {
                    "date": "2024-02-14",
                    "severity": "Low",
                    "description": "Minor weld repair needed on section 45.",
                    "impact": "2 hour delay.",
                    "resolution": "Rewelded and passed X-ray."
                }
            ]
        },
        {
            "contract_id": "CNT-IT-001",
            "incidents": []
        },
        {
            "contract_id": "CNT-LOG-001",
            "incidents": []
        },
        {
            "contract_id": "CNT-HSE-001",
            "incidents": [
                {
                    "date": "2024-01-20",
                    "severity": "High",
                    "description": "Missed Environmental Impact Assessment filing deadline.",
                    "impact": "Regulatory fine of $15,000 for the project.",
                    "resolution": "Late filing completed, vendor still disputing fine liability."
                },
                {
                    "date": "2024-03-05",
                    "severity": "Medium",
                    "description": "Falsified safety inspection record for truck fleet.",
                    "impact": "Severe breach of trust and safety compliance.",
                    "resolution": "Vendor warned of contract termination; re-inspection ordered."
                }
            ]
        }
    ]

    # 5. Contracts (Main Registry)
    contracts_data = [
        {
            "contract_id": "CNT-OG-001",
            "vendor_name": "Petro-Drill Solutions",
            "department": "Drilling",
            "sample_key": "petro_drill"
        },
        {
            "contract_id": "CNT-OG-002",
            "vendor_name": "Gulf Pipelines Corp",
            "department": "Pipeline",
            "sample_key": "gulf_pipeline_new"
        },
        {
            "contract_id": "CNT-IT-001",
            "vendor_name": "SafeNet IT Services",
            "department": "IT",
            "sample_key": "safenet_it"
        },
        {
            "contract_id": "CNT-LOG-001",
            "vendor_name": "Global Logistics Ltd",
            "department": "Logistics",
            "sample_key": "global_logistics"
        },
        {
            "contract_id": "CNT-HSE-001",
            "vendor_name": "Apex HSE Consulting",
            "department": "HSE",
            "sample_key": "apex_hse_new"
        }
    ]

    # Clear and Insert
    collections = {
        "market": market_data,
        "performance": performance_data,
        "reviews": reviews_data,
        "incidents": incidents_data,
        "contracts": contracts_data
    }

    for col_name, data in collections.items():
        db[col_name].delete_many({}) # Clear existing for fresh seed
        if data:
            db[col_name].insert_many(data)
            print(f"Inserted {len(data)} documents into '{col_name}' collection.")

    print("\n✅ MongoDB Database Seeding Completed Successfully!")

if __name__ == "__main__":
    seed_data()
