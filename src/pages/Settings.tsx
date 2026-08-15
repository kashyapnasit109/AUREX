import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings as SettingsIcon,
  ShieldCheck,
  Building2,
  Download,
  Upload,
  KeyRound,
  Check,
  CheckCircle2,
  ShieldAlert,
  Server,
  FileJson,
  Cpu,
  Sparkles,
  Save,
  RotateCcw,
  Zap
} from 'lucide-react';
import { AurexAPI } from '../services/api';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'security' | 'organization' | 'system'>('security');

  // 2FA Google Authenticator Modal State
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [totpSecret, setTotpSecret] = useState<string | null>(null);
  const [totpInput, setTotpInput] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [userEmail, setUserEmail] = useState('admin@aurex.intelligence');

  // Organization Data Ingestion State
  const [orgName, setOrgName] = useState('AUREX Global Commerce Inc.');
  const [orgIndustry, setOrgIndustry] = useState('Retail & E-Commerce Technology');
  const [orgRevenue, setOrgRevenue] = useState('$42.8M USD');
  const [rawOrgJson, setRawOrgJson] = useState('');
  const [orgSaveSuccess, setOrgSaveSuccess] = useState(false);

  // AI Model Configuration State
  const loadModelConfig = () => {
    try {
      const saved = localStorage.getItem('AUREX_AI_MODEL_CONFIG');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { provider: 'cloud', model_name: 'claude-opus-4-8' };
  };
  const [aiModelName, setAiModelName] = useState<string>(loadModelConfig().model_name || 'claude-opus-4-8');
  const [ollamaUrl, setOllamaUrl] = useState<string>(loadModelConfig().custom_url || 'http://localhost:1234/v1');
  const [customModelUrl, setCustomModelUrl] = useState<string>(loadModelConfig().custom_url || '');
  const [customModelApiKey, setCustomModelApiKey] = useState<string>(loadModelConfig().custom_api_key || '');
  const [customModelName, setCustomModelName] = useState<string>(loadModelConfig().model_name || '');
  const [ollamaTestResult, setOllamaTestResult] = useState<any>(null);


  // General Feedback State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let email = 'admin@aurex.intelligence';
    try {
      const storedUser = localStorage.getItem('AUREX_AUTH_USER');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.email) {
          email = parsed.email;
          setUserEmail(parsed.email);
        }
        // Check totp_enabled from stored auth
        if (parsed.totp_enabled) {
          setIs2FAEnabled(true);
        }
      }
    } catch {
      // ignore
    }

    // Check 2FA status from backend
    AurexAPI.get2FAStatus(email).then((res) => {
      if (res && res.enabled) {
        setIs2FAEnabled(true);
      }
    });

    // Load org data from API
    AurexAPI.getOrgData().then((res) => {
      if (res) {
        if (res.organization_name) setOrgName(res.organization_name);
        if (res.industry) setOrgIndustry(res.industry);
        if (res.annual_revenue) setOrgRevenue(res.annual_revenue);
        setRawOrgJson(JSON.stringify(res, null, 2));
      }
    });
  }, []);

  // Handle 2FA Setup
  const handleStart2FASetup = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const res = await AurexAPI.setup2FA(userEmail);
      setIsLoading(false);
      if (res && res.secret && res.qr_code) {
        setTotpSecret(res.secret);
        setQrCodeData(res.qr_code);
        setTwoFactorModalOpen(true);
      } else {
        setErrorMessage(res?.error || 'Failed to initialize Google Authenticator 2FA.');
      }
    } catch {
      setIsLoading(false);
      setErrorMessage('2FA setup failed. Ensure backend service is running.');
    }
  };

  // Confirm 2FA Code Activation
  const handleConfirm2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!totpInput || totpInput.length !== 6) {
      setErrorMessage('Please enter the 6-digit code from Google Authenticator app.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await AurexAPI.verify2FA({
        email: userEmail,
        code: totpInput
      });
      setIsLoading(false);
      if (res && res.verified) {
        setIs2FAEnabled(true);
        setTwoFactorModalOpen(false);
        setSuccessMessage('Google Authenticator 2FA successfully activated on your account!');
        // Update stored user with totp_enabled
        try {
          const storedUser = localStorage.getItem('AUREX_AUTH_USER');
          if (storedUser) {
            const parsed = JSON.parse(storedUser);
            parsed.totp_enabled = true;
            localStorage.setItem('AUREX_AUTH_USER', JSON.stringify(parsed));
          }
        } catch {}
      } else {
        setErrorMessage(res?.error || 'Invalid 2FA Code. Please try again.');
      }
    } catch {
      setIsLoading(false);
      setErrorMessage('2FA verification failed.');
    }
  };

  // Generate Dummy Organization Data File Download
  const handleGenerateSampleData = () => {
    const sampleData = {
      organization_name: "Acme Global Retail Systems",
      industry: "Consumer Electronics & Omnichannel Retail",
      annual_revenue: "$64.5M USD",
      growth_rate: "+28.4% YoY",
      top_products: [
        { name: "Acme SoundMax Wireless ANC", sku: "SKU-ACME-100", price: 249.99, margin: "65%", stock: 1800 },
        { name: "Acme UltraLite Gaming Headset", sku: "SKU-ACME-200", price: 189.99, margin: "60%", stock: 950 },
        { name: "Acme FitEar Noise-Isolating Buds", sku: "SKU-ACME-300", price: 129.99, margin: "72%", stock: 3200 }
      ],
      regional_markets: [
        { region: "North America", sales_share: "52%", channel: "Direct-to-Consumer (D2C)" },
        { region: "Europe", sales_share: "30%", channel: "Retail Distribution" },
        { region: "Asia-Pacific", sales_share: "18%", channel: "E-Commerce Marketplaces" }
      ],
      key_initiatives: [
        "Deploy AI-driven personalization to lift cart conversion from 2.8% to 4.2%",
        "Reduce logistics fulfillment latency from 3 days to same-day delivery"
      ]
    };

    const jsonStr = JSON.stringify(sampleData, null, 2);
    setRawOrgJson(jsonStr);
    setOrgName(sampleData.organization_name);
    setOrgIndustry(sampleData.industry);
    setOrgRevenue(sampleData.annual_revenue);

    // Download JSON file
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample_organization_data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setSuccessMessage('Sample organization data file generated and downloaded! Click Save to ingest data into Aiden AI.');
  };

  // Save Custom Organization Data
  const handleSaveOrgData = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      let parsedData: any = {};
      if (rawOrgJson.trim()) {
        parsedData = JSON.parse(rawOrgJson);
      } else {
        parsedData = {
          organization_name: orgName,
          industry: orgIndustry,
          annual_revenue: orgRevenue
        };
      }

      parsedData.organization_name = orgName;
      parsedData.industry = orgIndustry;
      parsedData.annual_revenue = orgRevenue;

      const res = await AurexAPI.updateOrgData(parsedData);
      setIsLoading(false);

      if (res && res.status === 'SUCCESS') {
        localStorage.setItem('AUREX_CUSTOM_ORG_DATA', JSON.stringify(parsedData));
        setOrgSaveSuccess(true);
        setSuccessMessage('Custom organization data ingested successfully! Aiden AI is now customized with your data.');
        setTimeout(() => setOrgSaveSuccess(false), 4000);
      } else {
        setErrorMessage(res?.error || 'Failed to ingest custom organization data.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage('Invalid JSON format in custom organization data field. Please format as valid JSON.');
    }
  };

  // Upload JSON or CSV File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (file.name.endsWith('.json')) {
        try {
          const parsed = JSON.parse(content);
          setRawOrgJson(JSON.stringify(parsed, null, 2));
          if (parsed.organization_name) setOrgName(parsed.organization_name);
          if (parsed.industry) setOrgIndustry(parsed.industry);
          if (parsed.annual_revenue) setOrgRevenue(parsed.annual_revenue);
          setSuccessMessage(`File '${file.name}' loaded successfully! Click Save to ingest.`);
        } catch {
          setErrorMessage('Failed to parse uploaded JSON file.');
        }
      } else {
        // Plain text / CSV
        setRawOrgJson(content);
        setSuccessMessage(`File '${file.name}' content imported! Click Save to ingest.`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            <SettingsIcon className="w-3.5 h-3.5" />
            <span>Platform Configuration & Security Center</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">
            System & Security Settings
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Manage Google Authenticator 2FA, ingest custom organization data, and configure AI models.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 bg-obsidian-850 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'security'
                ? 'bg-cyan-500 text-obsidian-950 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>2FA & Security</span>
          </button>

          <button
            onClick={() => setActiveTab('organization')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'organization'
                ? 'bg-lime-500 text-obsidian-950 shadow-lime-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Organization Data</span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'system'
                ? 'bg-amber-500 text-obsidian-950 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Model & Infrastructure</span>
          </button>
        </div>
      </div>

      {/* Global Alerts */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* TAB 1: 2FA & GOOGLE AUTHENTICATOR SECURITY */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-obsidian-850 border border-white/10 rounded-2xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Google Authenticator Two-Factor Authentication (2FA)</h3>
                  <p className="text-xs text-slate-400">Protect your account using TOTP verification codes from Google Authenticator.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-medium flex items-center gap-1.5 ${
                  is2FAEnabled
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${is2FAEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <span>{is2FAEnabled ? '2FA Active & Protected' : '2FA Setup Available'}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">How Google Authenticator Works:</h4>
                <ul className="space-y-2 text-xs text-slate-400 font-sans">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>Scan the QR code with Google Authenticator app on iOS or Android.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>Enter the 6-digit TOTP code generated in real-time by your app.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>Subsequent sign-ins will prompt for your 2FA verification code.</span>
                  </li>
                </ul>

                <div className="pt-2">
                  {is2FAEnabled ? (
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Google Authenticator 2FA is <strong>active and protecting</strong> your account.</span>
                      </div>
                      <button
                        onClick={handleStart2FASetup}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-xl bg-obsidian-950 hover:bg-obsidian-800 border border-white/10 hover:border-amber-500/40 text-amber-300 font-bold text-xs transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reconfigure / Reset 2FA</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleStart2FASetup}
                      disabled={isLoading}
                      className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-obsidian-950 font-bold text-xs shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>{isLoading ? 'Generating QR Code...' : 'Setup Google Authenticator 2FA'}</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-obsidian-950 border border-white/10 text-center space-y-3">
                <ShieldCheck className="w-12 h-12 text-cyan-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Google Authenticator Health Check</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Account binding target: <strong className="text-cyan-400 font-mono">{userEmail}</strong>
                </p>
                <div className="p-2.5 rounded-xl bg-obsidian-850 border border-white/5 text-[11px] font-mono text-slate-400">
                  Algorithm: TOTP-SHA1 (30s Window) • QR Code Engine Ready
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOM ORGANIZATION DATA INGESTION */}
      {activeTab === 'organization' && (
        <div className="space-y-6">
          <div className="bg-obsidian-850 border border-white/10 rounded-2xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-lime-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Custom Organization Data Ingestion</h3>
                  <p className="text-xs text-slate-400">Upload or input your company's actual data for personalized AI responses from Aiden.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleGenerateSampleData}
                  className="px-3.5 py-2 rounded-xl bg-lime-500/15 hover:bg-lime-500/25 border border-lime-500/30 text-lime-400 font-bold text-xs flex items-center gap-1.5 transition-all shadow-lime-glow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Generate & Download Sample Dummy Data File</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveOrgData} className="space-y-5 text-xs font-sans">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 uppercase text-[11px] mb-1 font-medium">Organization Name</label>
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="Acme Global Commerce Inc."
                    className="w-full bg-obsidian-950 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-lime-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase text-[11px] mb-1 font-medium">Industry Sector</label>
                  <input
                    type="text"
                    required
                    value={orgIndustry}
                    onChange={(e) => setOrgIndustry(e.target.value)}
                    placeholder="Retail & E-Commerce Technology"
                    className="w-full bg-obsidian-950 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-lime-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase text-[11px] mb-1 font-medium">Annual Revenue / Scale</label>
                  <input
                    type="text"
                    required
                    value={orgRevenue}
                    onChange={(e) => setOrgRevenue(e.target.value)}
                    placeholder="$42.8M USD"
                    className="w-full bg-obsidian-950 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-lime-400 transition-colors font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-slate-400 uppercase text-[11px] font-medium flex items-center gap-1.5">
                    <FileJson className="w-3.5 h-3.5 text-lime-400" />
                    <span>Raw Organization Data (JSON / CSV Format)</span>
                  </label>
                  <label className="cursor-pointer text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload .json or .csv file</span>
                    <input type="file" accept=".json,.csv,.txt" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
                <textarea
                  rows={8}
                  value={rawOrgJson}
                  onChange={(e) => setRawOrgJson(e.target.value)}
                  placeholder={`{\n  "organization_name": "Your Company",\n  "top_products": [\n    { "name": "Product A", "price": 199.99, "stock": 500 }\n  ]\n}`}
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl p-3 text-lime-300 font-mono text-xs outline-none focus:border-lime-400 transition-colors"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 rounded-xl bg-lime-500 hover:bg-lime-400 text-obsidian-950 font-bold text-xs shadow-lime-glow transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isLoading ? 'Ingesting Organization Data...' : 'Save & Ingest Organization Data for AI'}</span>
                </button>

                {orgSaveSuccess && (
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Data Ingested into Aiden AI Core!
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: AI MODEL CONFIGURATION */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          {/* Cloud Model Config */}
          <div className="bg-obsidian-850 border border-white/10 rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Cloud AI Model (Default)</h3>
                <p className="text-xs text-slate-400">SeekAI cloud inference via Claude Opus 4. Requires API key in .env file.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-obsidian-950 border border-white/10 space-y-1">
                <span className="text-slate-500 text-[10px] font-mono uppercase">Active Model</span>
                <p className="text-white font-bold font-mono">claude-opus-4-8</p>
              </div>
              <div className="p-4 rounded-xl bg-obsidian-950 border border-white/10 space-y-1">
                <span className="text-slate-500 text-[10px] font-mono uppercase">API Timeout</span>
                <p className="text-white font-bold font-mono">30 seconds</p>
              </div>
            </div>
          </div>

          {/* Local Model Config (LM Studio) */}
          <div className="bg-obsidian-850 border border-white/10 rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Local AI Model (LM Studio)</h3>
                <p className="text-xs text-slate-400">Run local LLMs in LM Studio. Download from <a href="https://lmstudio.ai" target="_blank" rel="noreferrer" className="text-purple-400 hover:underline font-bold">lmstudio.ai</a>, load any model, and start the local server on <code className="px-1.5 py-0.5 bg-obsidian-950 rounded text-purple-300 text-[10px] font-mono">http://localhost:1234/v1</code></p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 uppercase text-[11px] mb-1 font-medium">LM Studio Local Server URL</label>
                <input
                  type="text"
                  value={ollamaUrl || 'http://localhost:1234/v1'}
                  onChange={(e) => setOllamaUrl(e.target.value)}
                  placeholder="http://localhost:1234/v1"
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl p-3 text-white text-xs font-mono outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 uppercase text-[11px] mb-1 font-medium">Model Identifier (Optional)</label>
                <input
                  type="text"
                  value={aiModelName}
                  onChange={(e) => setAiModelName(e.target.value)}
                  placeholder="default (uses active loaded model in LM Studio)"
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl p-3 text-white text-xs font-mono outline-none focus:border-purple-400"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={async () => {
                  setOllamaTestResult(null);
                  setIsLoading(true);
                  const res = await AurexAPI.testLMStudioConnection(ollamaUrl || 'http://localhost:1234/v1');
                  setIsLoading(false);
                  setOllamaTestResult(res);
                }}
                disabled={isLoading}
                className="px-4 py-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Server className="w-3.5 h-3.5" />
                <span>{isLoading ? 'Testing...' : 'Test LM Studio Connection'}</span>
              </button>
              <button
                onClick={() => {
                  const config = { provider: 'local', model_name: aiModelName || 'default', custom_url: ollamaUrl || 'http://localhost:1234/v1' };
                  localStorage.setItem('AUREX_AI_MODEL_CONFIG', JSON.stringify(config));
                  setSuccessMessage('LM Studio local model configuration saved! Switch to LM Studio in Aiden chat.');
                }}
                className="px-4 py-2.5 rounded-xl bg-lime-500/15 hover:bg-lime-500/25 border border-lime-500/30 text-lime-300 font-bold text-xs flex items-center gap-2 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save LM Studio Config</span>
              </button>
            </div>
            {ollamaTestResult && (
              <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${ollamaTestResult.connected ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'}`}>
                {ollamaTestResult.connected ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />}
                <div>
                  {ollamaTestResult.connected ? (
                    <><strong>LM Studio Connected!</strong> Loaded Models: {ollamaTestResult.available_models?.join(', ') || 'Active Loaded Model Ready'}. ✅ Ready for local inference.</>
                  ) : (
                    <><strong>Connection Failed:</strong> {ollamaTestResult.error}. Please ensure LM Studio Local Server is started on <code className="px-1 py-0.5 bg-obsidian-950 rounded">http://localhost:1234</code></>
                  )}
                </div>
              </div>
            )}
          </div>


          {/* Custom Model Config */}
          <div className="bg-obsidian-850 border border-white/10 rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <SettingsIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Custom AI Model Endpoint</h3>
                <p className="text-xs text-slate-400">Connect any OpenAI-compatible API endpoint (LMStudio, vLLM, Together AI, etc.)</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 uppercase text-[11px] mb-1 font-medium">API Endpoint URL</label>
                <input
                  type="text"
                  value={customModelUrl}
                  onChange={(e) => setCustomModelUrl(e.target.value)}
                  placeholder="http://localhost:1234/v1/chat/completions"
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl p-3 text-white text-xs font-mono outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 uppercase text-[11px] mb-1 font-medium">Model Name</label>
                <input
                  type="text"
                  value={customModelName}
                  onChange={(e) => setCustomModelName(e.target.value)}
                  placeholder="my-custom-model"
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl p-3 text-white text-xs font-mono outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 uppercase text-[11px] mb-1 font-medium">API Key (Optional)</label>
                <input
                  type="password"
                  value={customModelApiKey}
                  onChange={(e) => setCustomModelApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl p-3 text-white text-xs font-mono outline-none focus:border-amber-400"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={async () => {
                  setErrorMessage(null);
                  setIsLoading(true);
                  const res = await AurexAPI.testAIConnection({
                    provider: 'custom',
                    api_key: customModelApiKey,
                    url: customModelUrl,
                    model: customModelName
                  });
                  setIsLoading(false);
                  if (res.connected) {
                    setSuccessMessage(res.message || 'Custom AI endpoint connected successfully!');
                  } else {
                    setErrorMessage(res.error || 'Custom AI test connection failed.');
                  }
                }}
                disabled={isLoading}
                className="px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isLoading ? 'Testing...' : 'Test Connection'}</span>
              </button>
              <button
                onClick={() => {
                  const config = { provider: 'custom', model_name: customModelName, custom_url: customModelUrl, custom_api_key: customModelApiKey };
                  localStorage.setItem('AUREX_AI_MODEL_CONFIG', JSON.stringify(config));
                  setSuccessMessage('Custom model configuration saved! Switch to Custom model in Aiden chat.');
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-2 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Custom Model Config</span>
              </button>
            </div>
          </div>

          {/* System Info */}
          <div className="bg-obsidian-850 border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
              <div className="p-4 rounded-xl bg-obsidian-950 border border-white/10 space-y-1">
                <span className="text-slate-500 text-[10px] font-mono uppercase">Gmail SMTP</span>
                <p className="text-white font-bold font-mono text-sm">smtp.gmail.com:587</p>
                <p className="text-[11px] text-slate-400">Email verification active</p>
              </div>
              <div className="p-4 rounded-xl bg-obsidian-950 border border-white/10 space-y-1">
                <span className="text-slate-500 text-[10px] font-mono uppercase">DuckDB OLAP</span>
                <p className="text-white font-bold font-mono text-sm">In-Memory Engine</p>
                <p className="text-[11px] text-slate-400">Sub-second SQL queries</p>
              </div>
              <div className="p-4 rounded-xl bg-obsidian-950 border border-white/10 space-y-1">
                <span className="text-slate-500 text-[10px] font-mono uppercase">RAG Engine</span>
                <p className="text-white font-bold font-mono text-sm">TF-IDF Retrieval</p>
                <p className="text-[11px] text-slate-400">Organization data + product catalog indexed</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GOOGLE AUTHENTICATOR 2FA SETUP MODAL */}
      <AnimatePresence>
        {twoFactorModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-md"
            onClick={() => setTwoFactorModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-obsidian-850 rounded-2xl p-6 border border-cyan-500/40 space-y-5 shadow-2xl font-sans"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-mono">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Google Authenticator (2FA) Setup</span>
                </div>
                <button
                  onClick={() => setTwoFactorModalOpen(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleConfirm2FA} className="space-y-4">
                <div className="text-center space-y-3">
                  <h3 className="text-base font-bold text-white">Scan QR Code with Google Authenticator</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Open Google Authenticator app on your phone, tap <strong className="text-white">+</strong> and scan the QR code below:
                  </p>

                  {qrCodeData && (
                    <div className="p-3 bg-white rounded-2xl w-48 h-48 mx-auto shadow-xl flex items-center justify-center">
                      <img src={qrCodeData} alt="Google Authenticator QR Code" className="w-full h-full object-contain" />
                    </div>
                  )}

                  <div className="p-2.5 rounded-xl bg-obsidian-950 border border-white/10 text-xs font-mono">
                    <span className="text-slate-400 text-[10px] block mb-1 uppercase">Or Enter Secret Key Manually:</span>
                    <strong className="text-lime-400 tracking-wider select-all">{totpSecret}</strong>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] text-slate-300 uppercase mb-1 font-medium text-center">
                    Enter 6-Digit Authenticator Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={totpInput}
                    onChange={(e) => {
                      setTotpInput(e.target.value.replace(/\D/g, ''));
                      setErrorMessage(null);
                    }}
                    className="w-full bg-obsidian-950 border border-cyan-500/40 focus:border-cyan-400 rounded-xl p-3 text-center text-white font-mono text-xl tracking-[0.4em] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || totpInput.length !== 6}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-obsidian-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isLoading ? 'Activating 2FA...' : 'Verify & Enable Google Authenticator'}</span>
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
