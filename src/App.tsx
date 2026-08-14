import { Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Security } from './pages/Security';
import { AppShell } from './components/layout/AppShell';
import { Overview } from './pages/Overview';
import { QuantStudio } from './pages/QuantStudio';
import { DataMart } from './pages/DataMart';
import { Aiden } from './pages/Aiden';
import { IntelligenceCore } from './pages/IntelligenceCore';
import { InsightEngine } from './pages/InsightEngine';
import { Customer360 } from './pages/Customer360';
import { ProductIntelligence } from './pages/ProductIntelligence';
import { DataHub } from './pages/DataHub';
import { WorkflowEngine } from './pages/WorkflowEngine';

export default function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/security" element={<Security />} />

      {/* Authenticated Platform Workspace */}
      <Route path="/app" element={<AppShell />}>
        <Route index element={<Navigate to="/app/overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="intelligence" element={<IntelligenceCore />} />
        <Route path="insights" element={<InsightEngine />} />
        <Route path="quant" element={<QuantStudio />} />
        <Route path="datamart" element={<DataMart />} />
        <Route path="aiden" element={<Aiden />} />
        <Route path="data" element={<DataHub />} />
        <Route path="workflows" element={<WorkflowEngine />} />
        <Route path="customers/:id" element={<Customer360 />} />
        <Route path="products/:sku" element={<ProductIntelligence />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
