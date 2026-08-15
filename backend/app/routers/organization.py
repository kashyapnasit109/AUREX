import json
import os
import logging
from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from typing import Dict, Any, Optional

logger = logging.getLogger("aurex.org")

router = APIRouter(prefix="/organization", tags=["Organization Data"])

DATA_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "org_custom_data.json")

class OrgDataPayload(BaseModel):
    organization_name: Optional[str] = "AUREX Global Commerce Inc."
    industry: Optional[str] = "Retail & E-Commerce Technology"
    annual_revenue: Optional[str] = "$42.8M USD"
    growth_rate: Optional[str] = "+34.2% YoY"
    raw_data: Optional[Any] = None

def load_org_data() -> Dict[str, Any]:
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            logger.warning(f"[ORG DATA] Error reading json file: {e}")
    
    # Default sample seed
    return {
        "organization_name": "AUREX Global Commerce Inc.",
        "industry": "Retail & E-Commerce Technology",
        "annual_revenue": "$42.8M USD",
        "growth_rate": "+34.2% YoY",
        "top_products": [
            { "name": "AUREX Apex Studio Wireless Headphones", "sku": "SKU-AUDIO-9000", "price": 349.99, "margin": "68%", "stock": 1420 },
            { "name": "AUREX Voyager Pro ANC Headset", "sku": "SKU-AUDIO-8500", "price": 279.99, "margin": "64%", "stock": 840 },
            { "name": "AUREX Clarity ANC Earbuds", "sku": "SKU-AUDIO-7000", "price": 199.99, "margin": "71%", "stock": 2150 }
        ],
        "regional_markets": [
            { "region": "North America", "sales_share": "48%", "top_channel": "Direct-to-Consumer (D2C)" },
            { "region": "Europe & UK", "sales_share": "32%", "top_channel": "Enterprise B2B Procurement" },
            { "region": "Asia-Pacific", "sales_share": "20%", "top_channel": "Omnichannel Partners" }
        ],
        "business_goals": [
            "Scale D2C conversion rate from 3.2% to 4.5% using AI personalization",
            "Reduce inventory holding duration from 42 days to 28 days via DuckDB telemetry",
            "Expand European enterprise reseller contracts by Q4"
        ]
    }

def save_org_data(data: Dict[str, Any]):
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

@router.get("/data")
def get_organization_data():
    """Returns current uploaded/custom organization data"""
    return load_org_data()

@router.post("/data")
def update_organization_data(payload: Dict[str, Any] = Body(...)):
    """Saves custom uploaded organization data for AI personalization"""
    save_org_data(payload)
    logger.info(f"[ORG DATA UPDATE] Saved organization data for {payload.get('organization_name', 'Custom Org')}")
    return {"status": "SUCCESS", "message": "Custom organization data ingested successfully", "data": payload}
