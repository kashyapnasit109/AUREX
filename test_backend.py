import httpx
import json

BASE_URL = "https://aurex-backend-eski.onrender.com/api/v1"

print("=" * 60)
print("AUREX CLOUD BACKEND TEST SUITE")
print("Target:", BASE_URL)
print("=" * 60)

client = httpx.Client(timeout=120.0)

# 1. Health
try:
    r = client.get(f"{BASE_URL}/health")
    print("\n[1] Health Check:", r.status_code)
    print(json.dumps(r.json(), indent=2))
except Exception as e:
    print("[1] Health Check Error:", e)

# 2. Quant Backtest
try:
    payload = {
        "strategy_id": "strat_alpha_momentum",
        "strategy_name": "Alpha Trend Momentum v4",
        "train_split": 0.70,
        "initial_capital": 100000.0,
        "leverage": 2.0,
        "asset_pair": "BTC-PERP"
    }
    r = client.post(f"{BASE_URL}/quant/backtest", json=payload)
    print("\n[2] Quant Backtest:", r.status_code)
    data = r.json()
    print("Metrics:", json.dumps(data.get("metrics"), indent=2))
    print("Equity points generated:", len(data.get("equity_curve", [])))
    print("Trade records generated:", len(data.get("trade_ledger", [])))
except Exception as e:
    print("[2] Quant Backtest Error:", e)

# 3. Quant Experiment Lab
try:
    r = client.get(f"{BASE_URL}/quant/experiment")
    print("\n[3] Quant Experiment Lab:", r.status_code)
    print(json.dumps(r.json(), indent=2))
except Exception as e:
    print("[3] Quant Experiment Lab Error:", e)

# 4. DataMart Query
try:
    payload = {"dataset": "transactions", "region": "ALL"}
    r = client.post(f"{BASE_URL}/datamart/query", json=payload)
    print("\n[4] DataMart Query:", r.status_code)
    dm = r.json()
    print("DuckDB Query Latency:", dm.get("query_latency_ms"), "ms")
    print("Data Lineage Hash:", dm.get("data_lineage_hash"))
    print("Metrics Summary:", json.dumps(dm.get("metrics"), indent=2))
except Exception as e:
    print("[4] DataMart Query Error:", e)

# 5. DataMart NL Query (SeekAI Claude Opus)
try:
    payload = {"prompt": "What is the total revenue and transaction volume?"}
    r = client.post(f"{BASE_URL}/datamart/nl-query", json=payload)
    print("\n[5] DataMart NL Query (SeekAI):", r.status_code)
    print(json.dumps(r.json(), indent=2))
except Exception as e:
    print("[5] DataMart NL Query Error:", e)

# 6. Aiden Chat (SeekAI Claude Opus)
try:
    payload = {
        "messages": [
            {"role": "user", "content": "Explain our Q3 customer acquisition cost and retail margins."}
        ]
    }
    r = client.post(f"{BASE_URL}/aiden/chat", json=payload)
    print("\n[6] Aiden Chat (SeekAI):", r.status_code)
    print(json.dumps(r.json(), indent=2))
except Exception as e:
    print("[6] Aiden Chat Error:", e)

print("\n" + "=" * 60)
print("ALL TESTS COMPLETED")
print("=" * 60)
