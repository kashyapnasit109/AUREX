/**
 * AUREX Frontend API Service Layer
 * Connects React UI components to the FastAPI Backend Core at http://localhost:8000/api/v1
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) || 'http://localhost:8000/api/v1';

const getDerivedWsUrl = () => {
  if (import.meta.env.VITE_WS_URL) return import.meta.env.VITE_WS_URL as string;
  try {
    const url = new URL(API_BASE_URL);
    const wsProto = url.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${wsProto}//${url.host}/ws/telemetry`;
  } catch {
    return 'ws://localhost:8000/ws/telemetry';
  }
};

const WS_URL = getDerivedWsUrl();



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

export interface AidenModelConfig {
  provider: 'cloud' | 'local' | 'custom';
  model_name: string;
  custom_url?: string;
  custom_api_key?: string;
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
   * Resend 6-digit verification OTP code to user's email
   */
  static async resendCode(email: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/resend-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to resend code');
      return data;
    } catch (err: any) {
      console.warn('[AUREX API] Resend code fallback:', err);
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
   * Log in with Email and Password (requires verified email & optional 2FA totp_code)
   */
  static async login(params: { email: string; password: string; totp_code?: string }) {
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
   * Setup Google Authenticator 2FA (Generates QR Code & Base32 secret)
   */
  static async setup2FA(email: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/2fa/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || '2FA Setup failed');
      return data;
    } catch (err: any) {
      console.warn('[AUREX API] 2FA Setup error:', err);
      return { error: err.message || 'Failed to setup 2FA' };
    }
  }

  /**
   * Verify and activate 6-digit Google Authenticator code
   */
  static async verify2FA(params: { email: string; code: string }) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/2fa/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || '2FA Verification failed');
      return data;
    } catch (err: any) {
      console.warn('[AUREX API] 2FA Verify error:', err);
      return { error: err.message || 'Failed to verify 2FA code' };
    }
  }

  /**
   * Check if 2FA is already enabled for a user
   */
  static async get2FAStatus(email: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/2fa/status?email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error('2FA status check failed');
      return await res.json();
    } catch (err: any) {
      console.warn('[AUREX API] 2FA status error:', err);
      return { enabled: false, exists: false };
    }
  }

  /**
   * Google OAuth — send ID token from Google Identity Services
   */
  static async oauthGoogle(idToken: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/oauth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: idToken }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.detail || 'Google OAuth failed' };
      return data;
    } catch (err: any) {
      return { error: err.message || 'Google OAuth network error' };
    }
  }

  /**
   * GitHub OAuth — exchange authorization code for user info
   */
  static async oauthGithub(code: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/oauth/github`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.detail || 'GitHub OAuth failed' };
      return data;
    } catch (err: any) {
      return { error: err.message || 'GitHub OAuth network error' };
    }
  }

  /**
   * Test LM Studio local AI connection at http://localhost:1234/v1
   */
  static async testLMStudioConnection(url: string = 'http://localhost:1234/v1') {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/test-lmstudio?url=${encodeURIComponent(url)}`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('LM Studio test connection failed');
      return await res.json();
    } catch (err: any) {
      return { connected: false, error: err.message };
    }
  }

  /**
   * Backward compatible alias
   */
  static async testOllamaConnection(url: string = 'http://localhost:1234/v1') {
    return this.testLMStudioConnection(url);
  }



  /**
   * Get Custom Organization Data
   */
  static async getOrgData() {
    try {
      const res = await fetch(`${API_BASE_URL}/organization/data`);
      if (!res.ok) throw new Error('Failed to fetch org data');
      return await res.json();
    } catch (err: any) {
      console.warn('[AUREX API] getOrgData error:', err);
      return null;
    }
  }

  /**
   * Update & Upload Custom Organization Data for AI Personalization
   */
  static async updateOrgData(payload: any) {
    try {
      const res = await fetch(`${API_BASE_URL}/organization/data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to update org data');
      return data;
    } catch (err: any) {
      console.warn('[AUREX API] updateOrgData error:', err);
      return { error: err.message || 'Failed to save organization data' };
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
   * Execute Natural Language DuckDB SQL Query via SeekAI
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
   * Grounded Aiden AI Chat with RAG context & model selection
   */
  static async sendAidenChat(
    messages: AidenChatMessage[],
    modelConfig?: AidenModelConfig
  ) {
    try {
      const body: any = { messages };
      if (modelConfig) {
        body.model_provider = modelConfig.provider;
        body.model_name = modelConfig.model_name;
        if (modelConfig.custom_url) body.custom_url = modelConfig.custom_url;
        if (modelConfig.custom_api_key) body.custom_api_key = modelConfig.custom_api_key;
      }

      const res = await fetch(`${API_BASE_URL}/aiden/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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

  static chatAidenWithModel = AurexAPI.sendAidenChat;
}

