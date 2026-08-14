import { Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { AppShell } from './components/layout/AppShell';
import { Overview } from './pages/Overview';
import { IntelligenceCore } from './pages/IntelligenceCore';
import { QuantStudio } from './pages/QuantStudio';
import { DataMart } from './pages/DataMart';
import { InsightEngine } from './pages/InsightEngine';
import { Aiden } from './pages/Aiden';
import { Customer360 } from './pages/Customer360';
import { ProductIntelligence } from './pages/ProductIntelligence';
import { DataHub } from './pages/DataHub';
import { Security } from './pages/Security';
import { Auth } from './pages/Auth';

export function App() {
  return (
    <Routes>
      {/* Public Landing Surface */}
      <Route path="/" element={<Landing />} />

      {/* Authenticated Intelligence Platform Shell */}
      <Route path="/app" element={<AppShell />}>
        <Route index element={<Navigate to="/app/overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="intelligence" element={<IntelligenceCore />} />
        <Route path="quant" element={<QuantStudio />} />
        <Route path="datamart" element={<DataMart />} />
        <Route path="insights" element={<InsightEngine />} />
        <Route path="aiden" element={<Aiden />} />
        <Route path="customers" element={<Customer360 />} />
        <Route path="products" element={<ProductIntelligence />} />
        <Route path="data" element={<DataHub />} />
      </Route>

      {/* Auxiliary Pages */}
      <Route path="/security" element={<Security />} />
      <Route path="/login" element={<Auth />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
