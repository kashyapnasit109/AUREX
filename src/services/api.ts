/**
 * AUREX Frontend API Service Layer
 * Connects React UI components to the FastAPI Backend Core at http://localhost:8000/api/v1
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) || 'http://localhost:8000/api/v1';
const WS_URL = (import.meta.env.VITE_WS_URL as string | undefined) || 'ws://localhost:8000/ws/telemetry';


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
   * Register new user account (returns pending verification state with code)
   */
  static async signUp(params: { email: string; password: string; name: string }) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Registration failed');
      return data;
    } catch (err: any) {
      console.warn('[AUREX API] Sign up fallback:', err);
      return null;
    }
  }

  /**
   * Verify email address with 6-digit OTP code
   */
  static async verifyEmail(params: { email: string; code: string }) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Email verification failed');
      return data;
    } catch (err: any) {
      console.warn('[AUREX API] Email verification fallback:', err);
      return null;
    }
  }

  /**
   * Log in as Organization / Enterprise SSO
   */
  static async orgLogin(params: { work_email: string; org_id?: string; password: string }) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/org-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (!res.ok) {
        return { error: data.detail || 'Organization SSO authentication failed', status: res.status };
      }
      return data;
    } catch (err: any) {
      console.warn('[AUREX API] Org login fallback:', err);
      return { error: err.message || 'Network connection failed' };
    }
  }

  /**
   * Log in with Email and Password (requires verified email)
   */
  static async login(params: { email: string; password: string }) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (!res.ok) {
        return { error: data.detail || 'Authentication failed', status: res.status };
      }
      return data;
    } catch (err: any) {
      console.warn('[AUREX API] Login fallback:', err);
      return { error: err.message || 'Network connection failed' };
    }
  }

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
   * Execute 3-Strategy Experiment Comparison Lab
   */
  static async runExperiment() {
    try {
      const res = await fetch(`${API_BASE_URL}/quant/experiment`);
      if (!res.ok) throw new Error('Experiment lab failed');
      return await res.json();
    } catch (err) {
      console.warn('[AUREX API] Experiment Lab API fallback:', err);
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
   * Execute Natural Language DuckDB SQL Query via SeekAI (claude-opus-5)
   */
  static async runNLQuery(prompt: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/datamart/nl-query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error('NL Query failed');
      return await res.json();
    } catch (err) {
      console.warn('[AUREX API] NL Query API fallback:', err);
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
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ detail: `HTTP ${res.status} Error` }));
        return { error: errData.detail || `SeekAI API Error (HTTP ${res.status})` };
      }
      return await res.json();
    } catch (err: any) {
      return { error: err.message || 'Network connection failed' };
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
