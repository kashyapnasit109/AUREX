/**
 * AUREX Frontend API Service Layer
 * Connects React UI components to the FastAPI Backend Core at http://localhost:8000/api/v1
 */

const API_BASE_URL = 'http://localhost:8000/api/v1';
const WS_URL = 'ws://localhost:8000/ws/telemetry';

export interface BacktestParams {
  strategy_id: string;
  strategy_name: string;
  train_split: number;
  initial_capital: number;
  leverage: number;
  asset_pair: string;
}

export interface DataMartQueryParams {
  dataset: string;
  region: string;
}

export interface AidenChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class AurexAPI {
  /**
   * Health Check
   */
  static async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (!res.ok) throw new Error('Health check failed');
      return await res.json();
    } catch (err) {
      console.warn('[AUREX API] Health check unavailable:', err);
      return null;
    }
  }

  /**
   * Execute Real Quant Strategy Walk-Forward Backtest
   */
  static async runBacktest(params: BacktestParams) {
    try {
      const res = await fetch(`${API_BASE_URL}/quant/backtest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error('Backtest execution failed');
      return await res.json();
    } catch (err) {
      console.warn('[AUREX API] Backtest API fallback:', err);
      return null;
    }
  }

  /**
   * Query Real DuckDB DataMart Metrics & Insights
   */
  static async getDataMartMetrics(params: DataMartQueryParams) {
    try {
      const res = await fetch(`${API_BASE_URL}/datamart/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error('DataMart query failed');
      return await res.json();
    } catch (err) {
      console.warn('[AUREX API] DataMart API fallback:', err);
      return null;
    }
  }

  /**
   * Grounded Aiden Retail AI Chat with SHA-256 Data Lineage
   */
  static async sendAidenChat(messages: AidenChatMessage[]) {
    try {
      const res = await fetch(`${API_BASE_URL}/aiden/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });
      if (!res.ok) throw new Error('Aiden AI Chat failed');
      return await res.json();
    } catch (err) {
      console.warn('[AUREX API] Aiden Chat API fallback:', err);
      return null;
    }
  }

  /**
   * Connect to WebSocket Real-Time Telemetry Stream
   */
  static connectTelemetry(onMessage: (data: any) => void): () => void {
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(WS_URL);
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (e) {
          console.error('[AUREX WS] Error parsing telemetry:', e);
        }
      };
      ws.onerror = (err) => console.warn('[AUREX WS] Connection error:', err);
    } catch (err) {
      console.warn('[AUREX WS] Failed to establish WebSocket connection:', err);
    }

    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }
}
