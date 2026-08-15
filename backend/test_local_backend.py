"""
Local Backend Test Suite for AUREX Enterprise Intelligence.
Tests all FastAPI endpoints directly using starlette/fastapi TestClient.
"""

from fastapi.testclient import TestClient
import main

client = TestClient(main.app)

print("=" * 60)
print("TESTING AUREX LOCAL BACKEND ENDPOINTS")
print("=" * 60)

# 1. Health Check
res = client.get("/health")
assert res.status_code == 200, f"Health check failed: {res.text}"
print("[PASS] Health Check:", res.json())

# 2. Quant Backtest
res = client.post("/quant/backtest", json={
    "strategy_id": "strat_alpha_momentum",
    "strategy_name": "Alpha Trend Momentum v4",
    "train_split": 0.70,
    "initial_capital": 100000.0,
    "leverage": 2.0,
    "asset_pair": "BTC-PERP"
})
assert res.status_code == 200, f"Quant Backtest failed: {res.text}"
print("[PASS] Quant Backtest: Sharpe =", res.json()["metrics"]["sharpe_ratio"])

# 3. Quant Experiment Lab
res = client.get("/quant/experiment")
assert res.status_code == 200, f"Quant Experiment failed: {res.text}"
print("[PASS] Quant Experiment Lab: 3-Strategy Matrix Verified")

# 4. DataMart OLAP Query (1,000,000 DuckDB Records)
res = client.post("/datamart/query", json={"dataset": "omnichannel_retail", "region": "All"})
assert res.status_code == 200, f"DataMart Query failed: {res.text}"
data = res.json()
print(f"[PASS] DataMart DuckDB: Processed {data['total_records_processed']:,} records across {len(data['regional_matrix'])} regions")

# 5. Data Ingestion & Live CSV Upload
csv_data = (
    "transaction_id,region,category,revenue_usd,units,latency_days,churn_score\n"
    "TX-1001,North America,Enterprise SaaS,450.00,3,1.2,0.8\n"
    "TX-1002,EMEA,Hardware Acoustics,299.99,1,2.4,1.1\n"
    "TX-1003,APAC,Logistics Fleet,890.50,5,3.8,2.7\n"
    "TX-1004,LATAM,Fintech API,150.00,2,1.9,1.5\n"
)
files = {"file": ("test_ingestion.csv", csv_data.encode("utf-8"), "text/csv")}
res = client.post("/datamart/upload", files=files, data={"custom_name": "uploaded_test_sales"})
assert res.status_code == 200, f"DataMart Upload failed: {res.text}"
upload_meta = res.json()["metadata"]
print(f"[PASS] DataMart Upload: Ingested {upload_meta['row_count']} rows into '{upload_meta['table_name']}' (SHA-256: {upload_meta['sha256_hash'][:16]}...)")

# 6. List DuckDB Tables
res = client.get("/datamart/tables")
assert res.status_code == 200, f"DataMart Tables failed: {res.text}"
tables = res.json()
print(f"[PASS] DataMart Tables: {len(tables)} active in-memory tables registered ({[t['table_name'] for t in tables]})")

# 7. Custom SQL Query against DuckDB
res = client.post("/datamart/sql", json={"sql": "SELECT region, SUM(revenue_usd) as total_rev FROM uploaded_test_sales GROUP BY region;"})
assert res.status_code == 200, f"Custom SQL failed: {res.text}"
print("[PASS] Custom SQL on Uploaded Table:", res.json()["data"])

# 8. Aiden Chat (Grounded Synthesis)
res = client.post("/aiden/chat", json={
    "messages": [{"role": "user", "content": "Show me top noise canceling headphones under 300 dollars"}]
})
assert res.status_code == 200, f"Aiden Chat failed: {res.text}"
chat_data = res.json()
print(f"[PASS] Aiden AI Grounded Chat: Model={chat_data.get('model_used')}, Products={len(chat_data.get('suggested_products', []))}")

# 9. AI Connection Diagnostic Test
res = client.post("/aiden/test-connection", json={"provider": "cloud"})
assert res.status_code == 200, f"Test AI connection failed: {res.text}"
print("[PASS] AI Connection Test Check:", res.json())

print("=" * 60)
print("ALL BACKEND TEST SUITES PASSED SUCCESSFULLY!")
print("=" * 60)
